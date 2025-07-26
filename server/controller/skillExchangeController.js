import SkillExchange from "../Model/skillExchangeModel.js";

export const createSkillExchange = async (req, res) => {
    try {
        const {
            skillName,
            skillType,
            category,
            description,
            availability,
            contactInfo
        } = req.body;
        
        const skillExchange = new SkillExchange({
            skillName,
            skillType,
            category,
            description,
            availability,
            contactInfo,
            postedBy: req.user.id
        });
        
        await skillExchange.save();
        res.status(201).json(skillExchange);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllSkillExchanges = async (req, res) => {
    try {
        const exchanges = await SkillExchange.find()
            .populate("postedBy", "name email")
            .populate("matchedWith", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json(exchanges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSkillExchangeById = async (req, res) => {
    try {
        const exchange = await SkillExchange.findById(req.params.id)
            .populate("postedBy", "name");
        if (!exchange) {
            return res.status(404).json({ message: "Skill exchange not found" });
        }
        res.status(200).json(exchange);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSkillExchange = async (req, res) => {
    try {
        const exchange = await SkillExchange.findById(req.params.id);
        if (!exchange) {
            return res.status(404).json({ message: "Skill exchange not found" });
        }
        
        // Handle booking functionality
        if (req.body.status === "booked") {
            // Check if already booked
            if (exchange.status === "booked") {
                return res.status(409).json({ message: "This session is already booked by another student!" });
            }
            
            // Allow any authenticated user to book a session
            const updatedExchange = await SkillExchange.findByIdAndUpdate(
                req.params.id,
                { 
                    status: "booked",
                    matchedWith: req.user.id,
                    updatedAt: Date.now()
                },
                { new: true }
            ).populate("postedBy", "name");
            
            return res.status(200).json(updatedExchange);
        }
        
        // For other updates, only allow if user is the owner or admin
        if (exchange.postedBy.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: "Not authorized" });
        }
        
        const updatedExchange = await SkillExchange.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate("postedBy", "name");
        
        res.status(200).json(updatedExchange);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteSkillExchange = async (req, res) => {
    try {
        const exchange = await SkillExchange.findById(req.params.id);
        if (!exchange) {
            return res.status(404).json({ message: "Skill exchange not found" });
        }
        
        // Only allow deletion if user is the owner or admin
        if (exchange.postedBy.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: "Not authorized" });
        }
        
        await SkillExchange.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Skill exchange deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
