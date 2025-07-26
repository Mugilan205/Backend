import express from 'express';
import {
    getAllPolls,
    createPoll,
    voteOnPoll,
    getPollResults,
    updatePoll,
    deletePoll,
    getPollsByCategory
} from '../controller/pollsController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllPolls);
router.get('/category/:category', getPollsByCategory);
router.get('/:pollId/results', getPollResults);

// Protected routes
router.post('/:pollId/vote', verifyToken, voteOnPoll);

// Admin only routes
router.post('/', verifyToken, createPoll);
router.put('/:id', verifyToken, updatePoll);
router.delete('/:id', verifyToken, deletePoll);

export default router; 