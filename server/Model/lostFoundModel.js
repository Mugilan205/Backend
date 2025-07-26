import mongoose from "mongoose";

const lostFoundSchema = new mongoose.Schema({
    itemType: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    contactInfo: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['lost', 'found'],
        required: true
    },
    claimed: {
        type: Boolean,
        default: false
    },
    claimant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('LostFound', lostFoundSchema);
