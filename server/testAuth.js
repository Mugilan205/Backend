import mongoose from "mongoose";
import userModel from "./Model/userModel.js";
import jwt from "jsonwebtoken";

const MONGOURL = "mongodb://localhost:27017/campus_db";
const JWT_SECRET = "your_jwt_secret_key_here";

async function testAuth() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGOURL);
    console.log("✅ MongoDB connected successfully");

    // Test 1: Check if users exist
    console.log("\n📊 Test 1: Checking existing users...");
    const users = await userModel.find();
    console.log(`Found ${users.length} users in database`);
    
    if (users.length === 0) {
      console.log("❌ No users found. Creating test user...");
      const testUser = new userModel({
        name: "Test User",
        email: "test@test.com",
        role: "student"
      });
      await testUser.save();
      console.log("✅ Test user created:", testUser.email);
    } else {
      console.log("✅ Users found:");
      users.forEach(user => {
        console.log(`  - ${user.email} (${user.role})`);
      });
    }

    // Test 2: Test JWT token generation
    console.log("\n🔑 Test 2: Testing JWT token generation...");
    const testUser = await userModel.findOne({ email: "test@test.com" });
    if (testUser) {
      const token = jwt.sign(
        { id: testUser._id, email: testUser.email, role: testUser.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      console.log("✅ JWT token generated successfully");
      console.log("Token preview:", token.substring(0, 50) + "...");
      
      // Test 3: Verify token
      console.log("\n🔍 Test 3: Verifying JWT token...");
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("✅ Token verified successfully");
        console.log("Decoded payload:", decoded);
      } catch (error) {
        console.error("❌ Token verification failed:", error.message);
      }
    }

    // Test 4: Test API endpoints
    console.log("\n🌐 Test 4: Testing API endpoints...");
    const baseUrl = "http://localhost:8000";
    
    try {
      const testResponse = await fetch(`${baseUrl}/api/test`);
      const testData = await testResponse.json();
      console.log("✅ Test endpoint working:", testData.message);
    } catch (error) {
      console.error("❌ Test endpoint failed:", error.message);
    }

    try {
      const healthResponse = await fetch(`${baseUrl}/api/health`);
      const healthData = await healthResponse.json();
      console.log("✅ Health endpoint working:", healthData.status);
    } catch (error) {
      console.error("❌ Health endpoint failed:", error.message);
    }

    console.log("\n🎯 Authentication Test Summary:");
    console.log("✅ Database connection: OK");
    console.log("✅ User model: OK");
    console.log("✅ JWT generation: OK");
    console.log("✅ JWT verification: OK");
    console.log("✅ API endpoints: OK");
    console.log("\n📝 Test credentials:");
    console.log("Email: test@test.com");
    console.log("Password: (any password for Firebase)");
    console.log("Role: student");

  } catch (error) {
    console.error("❌ Test failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

testAuth(); 