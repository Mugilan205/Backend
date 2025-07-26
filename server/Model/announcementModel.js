import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  date: { type: Date, default: Date.now },
}, {
  timestamps: true
});

export default mongoose.model("Announcement", announcementSchema);
