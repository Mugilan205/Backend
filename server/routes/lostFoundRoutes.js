import express from "express";
import { createLostFound, getAllLostFound, getLostFoundById, updateLostFound, deleteLostFound } from "../controller/lostFoundController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes for Lost and Found
router.post("/", verifyToken, createLostFound);
router.get("/", verifyToken, getAllLostFound);
router.get("/:id", verifyToken, getLostFoundById);
router.put("/:id", verifyToken, updateLostFound);
router.delete("/:id", verifyToken, deleteLostFound);

export default router;
