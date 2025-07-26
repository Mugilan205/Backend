import express from 'express';
import {
    getAllTechNews,
    createTechNews,
    updateTechNews,
    deleteTechNews,
    getTechNewsByType
} from '../controller/techNewsController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllTechNews);
router.get('/type/:type', getTechNewsByType);

// Protected routes (admin only)
router.post('/', verifyToken, createTechNews);
router.put('/:id', verifyToken, updateTechNews);
router.delete('/:id', verifyToken, deleteTechNews);

export default router; 