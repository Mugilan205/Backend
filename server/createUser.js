import mongoose from "mongoose";
import userModel from "./Model/userModel.js";

const MONGOURL = "mongodb://localhost:27017/campus_db";

async function createUser() {
  try {
    await mongoose.connect(MONGOURL);
    console.log("✅ Connected to MongoDB");

    // Create a test user
    const testUser = new userModel({
      name: "Test User",
      email: "test@test.com",
      role: "student"
    });

    await testUser.save();
    console.log("✅ User created successfully!");
    console.log("📧 Email: test@test.com");
    console.log("🔑 Role: student");
    console.log("🆔 User ID:", testUser._id);

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

createUser(); 