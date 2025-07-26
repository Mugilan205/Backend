import TechNews from '../Model/techNewsModel.js';
import User from '../Model/userModel.js';

// Get all tech news
export const getAllTechNews = async (req, res) => {
    try {
        const techNews = await TechNews.find({ isActive: true })
            .populate('postedBy', 'name email')
            .sort({ priority: -1, createdAt: -1 });
        
        res.status(200).json(techNews);
    } catch (error) {
        console.error('Error fetching tech news:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create new tech news (admin only)
export const createTechNews = async (req, res) => {
    try {
        const { title, description, type, link, imageUrl, priority } = req.body;
        
        if (!title || !description || !type) {
            return res.status(400).json({ message: 'Title, description, and type are required' });
        }

        const newTechNews = new TechNews({
            title,
            description,
            type,
            link,
            imageUrl,
            priority: priority || 1,
            postedBy: req.user.id
        });

        const savedTechNews = await newTechNews.save();
        const populatedTechNews = await TechNews.findById(savedTechNews._id)
            .populate('postedBy', 'name email');

        res.status(201).json(populatedTechNews);
    } catch (error) {
        console.error('Error creating tech news:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update tech news (admin only)
export const updateTechNews = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        updateData.updatedAt = Date.now();

        const updatedTechNews = await TechNews.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate('postedBy', 'name email');

        if (!updatedTechNews) {
            return res.status(404).json({ message: 'Tech news not found' });
        }

        res.status(200).json(updatedTechNews);
    } catch (error) {
        console.error('Error updating tech news:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete tech news (admin only)
export const deleteTechNews = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedTechNews = await TechNews.findByIdAndDelete(id);
        
        if (!deletedTechNews) {
            return res.status(404).json({ message: 'Tech news not found' });
        }

        res.status(200).json({ message: 'Tech news deleted successfully' });
    } catch (error) {
        console.error('Error deleting tech news:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get tech news by type
export const getTechNewsByType = async (req, res) => {
    try {
        const { type } = req.params;
        
        const techNews = await TechNews.find({ 
            type, 
            isActive: true 
        })
        .populate('postedBy', 'name email')
        .sort({ priority: -1, createdAt: -1 });

        res.status(200).json(techNews);
    } catch (error) {
        console.error('Error fetching tech news by type:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}; 