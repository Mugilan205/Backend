import Complaint from "../Model/complaintsModel.js";

export const createComplaint = async (req, res) => {
  try {
    const { title, category, description, location, priority } = req.body;
    const complaint = new Complaint({
      title,
      category,
      description,
      location,
      priority,
      submittedBy: req.user.id
    });
    const savedComplaint = await complaint.save();
    const populatedComplaint = await Complaint.findById(savedComplaint._id)
      .populate('submittedBy', 'name email');
    res.status(201).json(populatedComplaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('submittedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('submittedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('comments.user', 'name email');
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    
    // Only allow updates if user is the owner or admin
    if (complaint.submittedBy.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('submittedBy', 'name email');
    
    res.status(200).json(updatedComplaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    
    // Only allow deletion if user is the owner or admin
    if (complaint.submittedBy.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    await Complaint.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    
    // Only allow status updates if user is admin or assigned to the complaint
    if (!req.user.isAdmin && complaint.assignedTo?.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    const updateData = { status };
    if (status === 'resolved') {
      updateData.resolvedDate = new Date();
    }
    
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('submittedBy', 'name email');
    
    res.status(200).json(updatedComplaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 