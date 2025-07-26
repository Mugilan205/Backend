import express from "express";
import { createTimetable, getTimetable, updateTimetable, deleteTimetable } from "../controller/timetableController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes for Timetable
router.post("/", verifyToken, createTimetable);
router.get("/", verifyToken, getTimetable);
router.put("/:id", verifyToken, updateTimetable);
router.delete("/:id", verifyToken, deleteTimetable);

export default router;
