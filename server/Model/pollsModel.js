import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    options: [{
        text: {
            type: String,
            required: true
        },
        votes: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users'
            },
            votedAt: {
                type: Date,
                default: Date.now
            }
        }]
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    allowMultipleVotes: {
        type: Boolean,
        default: false
    },
    endDate: {
        type: Date,
        required: false
    },
    category: {
        type: String,
        enum: ['academic', 'campus', 'events', 'feedback', 'general'],
        default: 'general'
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

export default mongoose.model('Poll', pollSchema); 