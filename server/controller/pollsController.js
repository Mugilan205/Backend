import Poll from '../Model/pollsModel.js';
import User from '../Model/userModel.js';

// Get all active polls
export const getAllPolls = async (req, res) => {
    try {
        const polls = await Poll.find({ isActive: true })
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        
        res.status(200).json(polls);
    } catch (error) {
        console.error('Error fetching polls:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create new poll (admin only)
export const createPoll = async (req, res) => {
    try {
        const { question, description, options, allowMultipleVotes, endDate, category } = req.body;
        
        if (!question || !options || options.length < 2) {
            return res.status(400).json({ 
                message: 'Question and at least 2 options are required' 
            });
        }

        const pollOptions = options.map(option => ({
            text: option,
            votes: []
        }));

        const newPoll = new Poll({
            question,
            description,
            options: pollOptions,
            allowMultipleVotes: allowMultipleVotes || false,
            endDate: endDate ? new Date(endDate) : null,
            category: category || 'general',
            createdBy: req.user.id
        });

        const savedPoll = await newPoll.save();
        const populatedPoll = await Poll.findById(savedPoll._id)
            .populate('createdBy', 'name email');

        res.status(201).json(populatedPoll);
    } catch (error) {
        console.error('Error creating poll:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Vote on a poll
export const voteOnPoll = async (req, res) => {
    try {
        const { pollId } = req.params;
        const { optionIndex } = req.body;
        const userId = req.user.id;

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        if (!poll.isActive) {
            return res.status(400).json({ message: 'Poll is not active' });
        }

        if (poll.endDate && new Date() > new Date(poll.endDate)) {
            return res.status(400).json({ message: 'Poll has ended' });
        }

        // Check if user has already voted
        const hasVoted = poll.options.some(option => 
            option.votes.some(vote => vote.user.toString() === userId)
        );

        if (hasVoted && !poll.allowMultipleVotes) {
            return res.status(400).json({ message: 'You have already voted on this poll' });
        }

        // Add vote to the selected option
        poll.options[optionIndex].votes.push({
            user: userId,
            votedAt: new Date()
        });

        poll.updatedAt = new Date();
        await poll.save();

        const updatedPoll = await Poll.findById(pollId)
            .populate('createdBy', 'name email');

        res.status(200).json(updatedPoll);
    } catch (error) {
        console.error('Error voting on poll:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get poll results
export const getPollResults = async (req, res) => {
    try {
        const { pollId } = req.params;

        const poll = await Poll.findById(pollId)
            .populate('createdBy', 'name email');

        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        // Calculate results
        const totalVotes = poll.options.reduce((sum, option) => sum + option.votes.length, 0);
        
        const results = poll.options.map(option => ({
            text: option.text,
            votes: option.votes.length,
            percentage: totalVotes > 0 ? ((option.votes.length / totalVotes) * 100).toFixed(1) : 0
        }));

        res.status(200).json({
            poll,
            results,
            totalVotes
        });
    } catch (error) {
        console.error('Error getting poll results:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update poll (admin only)
export const updatePoll = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        updateData.updatedAt = Date.now();

        const updatedPoll = await Poll.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate('createdBy', 'name email');

        if (!updatedPoll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        res.status(200).json(updatedPoll);
    } catch (error) {
        console.error('Error updating poll:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete poll (admin only)
export const deletePoll = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedPoll = await Poll.findByIdAndDelete(id);
        
        if (!deletedPoll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        res.status(200).json({ message: 'Poll deleted successfully' });
    } catch (error) {
        console.error('Error deleting poll:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get polls by category
export const getPollsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        
        const polls = await Poll.find({ 
            category, 
            isActive: true 
        })
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });

        res.status(200).json(polls);
    } catch (error) {
        console.error('Error fetching polls by category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}; 