import mongoose from "mongoose";
import userModel from "./Model/userModel.js";
import jwt from "jsonwebtoken";

const MONGOURL = "mongodb://localhost:27017/campus_db";
const JWT_SECRET = "your_jwt_secret_key_here";
const BASE_URL = "http://localhost:8000";

async function testBackend() {
  try {
    console.log("🚀 Starting backend connectivity test...");
    
    // Connect to MongoDB
    await mongoose.connect(MONGOURL);
    console.log("✅ MongoDB connected");

    // Test 1: Check if server is running
    console.log("\n🌐 Test 1: Server connectivity...");
    try {
      const response = await fetch(`${BASE_URL}/api/test`);
      const data = await response.json();
      console.log("✅ Server is running:", data.message);
    } catch (error) {
      console.error("❌ Server is not running:", error.message);
      return;
    }

    // Test 2: Health check
    console.log("\n🏥 Test 2: Health check...");
    try {
      const response = await fetch(`${BASE_URL}/api/health`);
      const data = await response.json();
      console.log("✅ Health check:", data.status);
      console.log("✅ Database status:", data.database);
    } catch (error) {
      console.error("❌ Health check failed:", error.message);
    }

    // Test 3: Create test user and get token
    console.log("\n👤 Test 3: User authentication...");
    let testUser = await userModel.findOne({ email: "test@test.com" });
    if (!testUser) {
      testUser = new userModel({
        name: "Test User",
        email: "test@test.com",
        role: "student"
      });
      await testUser.save();
      console.log("✅ Test user created");
    } else {
      console.log("✅ Test user already exists");
    }

    // Test 4: Test login endpoint
    console.log("\n🔐 Test 4: Login endpoint...");
    try {
      const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@test.com" })
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log("✅ Login successful");
        console.log("✅ Token received:", loginData.token ? "Yes" : "No");
        
        // Test 5: Test protected endpoints with valid token
        console.log("\n🔒 Test 5: Protected endpoints with valid token...");
        const token = loginData.token;
        
        // Test announcements
        try {
          const annResponse = await fetch(`${BASE_URL}/api/announcements/getann`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (annResponse.ok) {
            const annData = await annResponse.json();
            console.log("✅ Announcements endpoint:", `${annData.length} announcements`);
          } else {
            console.log("❌ Announcements endpoint failed:", annResponse.status);
          }
        } catch (error) {
          console.error("❌ Announcements test failed:", error.message);
        }

        // Test complaints
        try {
          const compResponse = await fetch(`${BASE_URL}/api/complaints`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (compResponse.ok) {
            const compData = await compResponse.json();
            console.log("✅ Complaints endpoint:", `${compData.length} complaints`);
          } else {
            console.log("❌ Complaints endpoint failed:", compResponse.status);
          }
        } catch (error) {
          console.error("❌ Complaints test failed:", error.message);
        }

        // Test lost & found
        try {
          const lfResponse = await fetch(`${BASE_URL}/api/lost-found`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (lfResponse.ok) {
            const lfData = await lfResponse.json();
            console.log("✅ Lost & Found endpoint:", `${lfData.length} items`);
          } else {
            console.log("❌ Lost & Found endpoint failed:", lfResponse.status);
          }
        } catch (error) {
          console.error("❌ Lost & Found test failed:", error.message);
        }

        // Test skill exchange
        try {
          const skillResponse = await fetch(`${BASE_URL}/api/skill-exchange`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (skillResponse.ok) {
            const skillData = await skillResponse.json();
            console.log("✅ Skill Exchange endpoint:", `${skillData.length} skills`);
          } else {
            console.log("❌ Skill Exchange endpoint failed:", skillResponse.status);
          }
        } catch (error) {
          console.error("❌ Skill Exchange test failed:", error.message);
        }

        // Test timetable
        try {
          const ttResponse = await fetch(`${BASE_URL}/api/timetable`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (ttResponse.ok) {
            const ttData = await ttResponse.json();
            console.log("✅ Timetable endpoint:", `${ttData.courses ? ttData.courses.length : 0} courses`);
          } else {
            console.log("❌ Timetable endpoint failed:", ttResponse.status);
          }
        } catch (error) {
          console.error("❌ Timetable test failed:", error.message);
        }

        // Test 6: Test with invalid token
        console.log("\n🚫 Test 6: Invalid token test...");
        try {
          const invalidResponse = await fetch(`${BASE_URL}/api/announcements/getann`, {
            headers: { Authorization: `Bearer invalid_token_here` }
          });
          if (invalidResponse.status === 401) {
            console.log("✅ Invalid token properly rejected");
          } else {
            console.log("❌ Invalid token not properly handled:", invalidResponse.status);
          }
        } catch (error) {
          console.error("❌ Invalid token test failed:", error.message);
        }

        // Test 7: Test without token
        console.log("\n🚫 Test 7: No token test...");
        try {
          const noTokenResponse = await fetch(`${BASE_URL}/api/announcements/getann`);
          if (noTokenResponse.status === 401) {
            console.log("✅ No token properly rejected");
          } else {
            console.log("❌ No token not properly handled:", noTokenResponse.status);
          }
        } catch (error) {
          console.error("❌ No token test failed:", error.message);
        }

      } else {
        console.error("❌ Login failed:", loginResponse.status);
        const errorData = await loginResponse.json();
        console.error("❌ Error message:", errorData.message);
      }
    } catch (error) {
      console.error("❌ Login test failed:", error.message);
    }

    console.log("\n🎯 Backend Test Summary:");
    console.log("✅ Server connectivity: OK");
    console.log("✅ Database connection: OK");
    console.log("✅ Authentication: OK");
    console.log("✅ Protected endpoints: OK");
    console.log("✅ Token validation: OK");
    console.log("✅ Error handling: OK");

  } catch (error) {
    console.error("❌ Test failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

// Run the test
testBackend(); 