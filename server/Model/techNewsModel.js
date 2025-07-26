import mongoose from "mongoose";

const techNewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['hackathon', 'internship', 'tech_news', 'opportunity', 'workshop']
    },
    link: {
        type: String,
        required: false
    },
    imageUrl: {
        type: String,
        required: false
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    priority: {
        type: Number,
        default: 1,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('TechNews', techNewsSchema); 