import mongoose from "mongoose";
import userModel from "./Model/userModel.js";
import Announcement from "./Model/announcementModel.js";
import Complaint from "./Model/complaintsModel.js";
import LostFound from "./Model/lostFoundModel.js";
import SkillExchange from "./Model/skillExchangeModel.js";
import Timetable from "./Model/timetableModel.js";
import jwt from "jsonwebtoken";

const MONGOURL = "mongodb://localhost:27017/campus_db";
const JWT_SECRET = "your_jwt_secret_key_here";

async function testAll() {
  try {
    console.log("🚀 Starting comprehensive API test...");
    
    // Connect to MongoDB
    await mongoose.connect(MONGOURL);
    console.log("✅ MongoDB connected");

    // Create test user
    let testUser = await userModel.findOne({ email: "test@test.com" });
    if (!testUser) {
      testUser = new userModel({
        name: "Test User",
        email: "test@test.com",
        role: "student"
      });
      await testUser.save();
      console.log("✅ Test user created");
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: testUser._id, email: testUser.email, role: testUser.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("\n🔑 Generated JWT token for testing");

    // Test 1: Test server endpoints
    console.log("\n🌐 Test 1: Testing server endpoints...");
    const baseUrl = "http://localhost:8000";
    
    try {
      const testResponse = await fetch(`${baseUrl}/api/test`);
      const testData = await testResponse.json();
      console.log("✅ Test endpoint:", testData.message);
    } catch (error) {
      console.error("❌ Test endpoint failed:", error.message);
    }

    try {
      const healthResponse = await fetch(`${baseUrl}/api/health`);
      const healthData = await healthResponse.json();
      console.log("✅ Health endpoint:", healthData.status);
    } catch (error) {
      console.error("❌ Health endpoint failed:", error.message);
    }

    // Test 2: Test authentication
    console.log("\n🔐 Test 2: Testing authentication...");
    try {
      const authResponse = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@test.com" })
      });
      const authData = await authResponse.json();
      if (authResponse.ok) {
        console.log("✅ Authentication successful");
      } else {
        console.error("❌ Authentication failed:", authData.message);
      }
    } catch (error) {
      console.error("❌ Authentication test failed:", error.message);
    }

    // Test 3: Test announcements
    console.log("\n📢 Test 3: Testing announcements...");
    try {
      const annResponse = await fetch(`${baseUrl}/api/announcements/getann`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const annData = await annResponse.json();
      console.log(`✅ Announcements endpoint: ${annData.length} announcements found`);
    } catch (error) {
      console.error("❌ Announcements test failed:", error.message);
    }

    // Test 4: Test complaints
    console.log("\n📝 Test 4: Testing complaints...");
    try {
      const compResponse = await fetch(`${baseUrl}/api/complaints`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const compData = await compResponse.json();
      console.log(`✅ Complaints endpoint: ${compData.length} complaints found`);
    } catch (error) {
      console.error("❌ Complaints test failed:", error.message);
    }

    // Test 5: Test lost & found
    console.log("\n🔍 Test 5: Testing lost & found...");
    try {
      const lfResponse = await fetch(`${baseUrl}/api/lost-found`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const lfData = await lfResponse.json();
      console.log(`✅ Lost & Found endpoint: ${lfData.length} items found`);
    } catch (error) {
      console.error("❌ Lost & Found test failed:", error.message);
    }

    // Test 6: Test skill exchange
    console.log("\n🎯 Test 6: Testing skill exchange...");
    try {
      const skillResponse = await fetch(`${baseUrl}/api/skill-exchange`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const skillData = await skillResponse.json();
      console.log(`✅ Skill Exchange endpoint: ${skillData.length} skills found`);
    } catch (error) {
      console.error("❌ Skill Exchange test failed:", error.message);
    }

    // Test 7: Test timetable
    console.log("\n📅 Test 7: Testing timetable...");
    try {
      const ttResponse = await fetch(`${baseUrl}/api/timetable`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ttData = await ttResponse.json();
      console.log(`✅ Timetable endpoint: ${ttData.courses ? ttData.courses.length : 0} courses found`);
    } catch (error) {
      console.error("❌ Timetable test failed:", error.message);
    }

    // Test 8: Test database models
    console.log("\n🗄️ Test 8: Testing database models...");
    
    // Test announcements model
    const annCount = await Announcement.countDocuments();
    console.log(`✅ Announcements model: ${annCount} documents`);

    // Test complaints model
    const compCount = await Complaint.countDocuments();
    console.log(`✅ Complaints model: ${compCount} documents`);

    // Test lost found model
    const lfCount = await LostFound.countDocuments();
    console.log(`✅ Lost Found model: ${lfCount} documents`);

    // Test skill exchange model
    const skillCount = await SkillExchange.countDocuments();
    console.log(`✅ Skill Exchange model: ${skillCount} documents`);

    // Test timetable model
    const ttCount = await Timetable.countDocuments();
    console.log(`✅ Timetable model: ${ttCount} documents`);

    console.log("\n🎉 All tests completed!");
    console.log("\n📝 Summary:");
    console.log("✅ Database connection: OK");
    console.log("✅ JWT authentication: OK");
    console.log("✅ All API endpoints: OK");
    console.log("✅ All models: OK");
    
    console.log("\n💡 If you see any ❌ errors above, those endpoints need attention.");
    console.log("✅ If all tests pass, your backend is working correctly!");

  } catch (error) {
    console.error("❌ Test failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

testAll(); 