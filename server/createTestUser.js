import mongoose from "mongoose";
import userModel from "./Model/userModel.js";

const MONGOURL = "mongodb://localhost:27017/campus_db";

async function createTestUser() {
  try {
    await mongoose.connect(MONGOURL);
    console.log("✅ Connected to MongoDB");

    // Check if test user already exists
    const existingUser = await userModel.findOne({ email: "test@example.com" });
    
    if (existingUser) {
      console.log("✅ Test user already exists:", existingUser.email);
      return;
    }

    // Create test user
    const testUser = new userModel({
      name: "Test User",
      email: "test@example.com",
      role: "student"
    });

    await testUser.save();
    console.log("✅ Test user created successfully:", testUser.email);
    console.log("📧 Email: test@example.com");
    console.log("🔑 Role: student");

  } catch (error) {
    console.error("❌ Error creating test user:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

createTestUser(); 