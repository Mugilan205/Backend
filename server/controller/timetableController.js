import Timetable from "../Model/timetableModel.js";
import { verifyToken } from "../middleware/authMiddleware.js";

export const createTimetable = async (req, res) => {
    try {
        const { semester, year, courses } = req.body;
        
        // Check if timetable already exists for this user and semester
        const existingTimetable = await Timetable.findOne({
            user: req.user.id,
            semester,
            year
        });
        
        if (existingTimetable) {
            // Update existing timetable instead of creating new one
            const updatedTimetable = await Timetable.findByIdAndUpdate(
                existingTimetable._id,
                { courses },
                { new: true }
            ).populate("user", "name");
            
            return res.status(200).json(updatedTimetable);
        }
        
        const timetable = new Timetable({
            user: req.user.id,
            semester,
            year,
            courses
        });
        
        await timetable.save();
        const populatedTimetable = await Timetable.findById(timetable._id)
            .populate("user", "name");
        res.status(201).json(populatedTimetable);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getTimetable = async (req, res) => {
    try {
        const { semester, year } = req.query;
        
        let query = { user: req.user.id };
        if (semester) query.semester = semester;
        if (year) query.year = year;
        
        const timetable = await Timetable.findOne(query)
            .populate("user", "name");
        
        if (!timetable) {
            // Return empty timetable structure instead of 404
            return res.status(200).json({
                user: req.user.id,
                semester: semester || 'Fall 2024',
                year: year || 2024,
                courses: []
            });
        }
        
        res.status(200).json(timetable);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTimetable = async (req, res) => {
    try {
        const timetable = await Timetable.findById(req.params.id);
        
        if (!timetable) {
            return res.status(404).json({ message: "Timetable not found" });
        }
        
        // Only allow updates if user owns the timetable
        if (timetable.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }
        
        const updatedTimetable = await Timetable.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate("user", "name");
        
        res.status(200).json(updatedTimetable);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTimetable = async (req, res) => {
    try {
        const timetable = await Timetable.findById(req.params.id);
        
        if (!timetable) {
            return res.status(404).json({ message: "Timetable not found" });
        }
        
        // Only allow deletion if user owns the timetable
        if (timetable.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }
        
        await Timetable.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Timetable deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
