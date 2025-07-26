import LostFound from "../Model/lostFoundModel.js";

export const createLostFound = async (req, res) => {
    try {
        console.log("Creating lost/found item:", req.body);
        const { itemType, title, description, location, contactInfo, status } = req.body;
        
        const lostFoundItem = new LostFound({
            itemType,
            title,
            description,
            location,
            date: new Date(),
            contactInfo,
            status,
            postedBy: req.user.id
        });
        
        const savedItem = await lostFoundItem.save();
        const populatedItem = await LostFound.findById(savedItem._id)
            .populate("postedBy", "name email");
            
        console.log("Item created successfully:", populatedItem._id);
        res.status(201).json(populatedItem);
    } catch (error) {
        console.error("Error creating lost/found item:", error);
        res.status(400).json({ message: error.message });
    }
};

export const getAllLostFound = async (req, res) => {
    try {
        console.log("Fetching all lost/found items");
        const items = await LostFound.find()
            .populate("postedBy", "name email")
            .sort({ createdAt: -1 });
        console.log(`Found ${items.length} items`);
        res.status(200).json(items);
    } catch (error) {
        console.error("Error fetching lost/found items:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getLostFoundById = async (req, res) => {
    try {
        const item = await LostFound.findById(req.params.id)
            .populate("postedBy", "name email");
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json(item);
    } catch (error) {
        console.error("Error fetching item by ID:", error);
        res.status(500).json({ message: error.message });
    }
};

export const updateLostFound = async (req, res) => {
    try {
        const item = await LostFound.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        // Only allow updates if user is the owner or admin
        if (item.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized" });
        }
        
        const updatedItem = await LostFound.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate("postedBy", "name email");
        res.status(200).json(updatedItem);
    } catch (error) {
        console.error("Error updating lost/found item:", error);
        res.status(400).json({ message: error.message });
    }
};

export const deleteLostFound = async (req, res) => {
    try {
        const item = await LostFound.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        // Only allow deletion if user is the owner or admin
        if (item.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized" });
        }
        
        await LostFound.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error("Error deleting lost/found item:", error);
        res.status(500).json({ message: error.message });
    }
};
