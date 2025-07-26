import mongoose from "mongoose";

const skillExchangeSchema = new mongoose.Schema({
    skillName: {
        type: String,
        required: true
    },
    skillType: {
        type: String,
        required: true,
        enum: ['academic', 'technical', 'creative', 'sports', 'other']
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    availability: {
        type: String,
        required: true
    },
    contactInfo: {
        type: String,
        required: false
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'booked', 'completed'],
        default: 'active'
    },
    matchedWith: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
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

export default mongoose.model('SkillExchange', skillExchangeSchema);
