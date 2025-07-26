import express from "express";
import { 
  createComplaint, 
  getAllComplaints, 
  getComplaintById, 
  updateComplaint, 
  deleteComplaint,
  updateComplaintStatus 
} from "../controller/complaintsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes for Complaints
router.post("/", verifyToken, createComplaint);
router.get("/", verifyToken, getAllComplaints);
router.get("/:id", verifyToken, getComplaintById);
router.put("/:id", verifyToken, updateComplaint);
router.delete("/:id", verifyToken, deleteComplaint);
router.patch("/:id/status", verifyToken, updateComplaintStatus);

export default router; 