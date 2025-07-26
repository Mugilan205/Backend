import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import lostFoundRoutes from "./routes/lostFoundRoutes.js";
import skillExchangeRoutes from "./routes/skillExchangeRoutes.js";
import timetableRoutes from "./routes/timetableRoutes.js";
import complaintsRoutes from "./routes/complaintsRoutes.js";
import techNewsRoutes from "./routes/techNewsRoutes.js";
import pollsRoutes from "./routes/pollsRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;
const MONGOURL = process.env.MONGO_URL || "mongodb://localhost:27017/campus_db";

console.log("🔗 Connecting to MongoDB:", MONGOURL);

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Database: ${MONGOURL}`);
      console.log(`🔗 Test URL: http://localhost:${PORT}/api/test`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
    console.error("💡 Make sure MongoDB is running on localhost:27017");
  });

// Test route to check if server is working
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "Server is working!", 
    timestamp: new Date().toISOString(),
    database: "Connected to MongoDB",
    port: PORT
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/users", userRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/lost-found", lostFoundRoutes);
app.use("/api/skill-exchange", skillExchangeRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/complaints", complaintsRoutes);
app.use("/api/tech-news", techNewsRoutes);
app.use("/api/polls", pollsRoutes);
