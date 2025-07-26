import Announcement from "../Model/announcementModel.js";

export const getAllAnnouncements = async (req, res) => {
  try {
    const data = await Announcement.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const { title, category, description } = req.body;
    const announcement = new Announcement({ 
      title, 
      category, 
      description,
      createdBy: req.user.id
    });
    const saved = await announcement.save();
    const populatedAnnouncement = await Announcement.findById(saved._id)
      .populate('createdBy', 'name email');
    res.status(201).json(populatedAnnouncement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
