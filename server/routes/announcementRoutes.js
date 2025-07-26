import express from "express";
import {
  getAllAnnouncements,
  createAnnouncement,
} from "../controller/announcementController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/getann", verifyToken, getAllAnnouncements);
router.post("/createann", verifyToken, createAnnouncement); 

export default router;
