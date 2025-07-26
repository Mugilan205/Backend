import mongoose from "mongoose";
import userModel from "./Model/userModel.js";
import jwt from "jsonwebtoken";

const MONGOURL = "mongodb://localhost:27017/campus_db";
const JWT_SECRET = "your_jwt_secret_key_here";

async function setup() {
  try {
    console.log("🚀 Starting comprehensive setup...");
    
    // Step 1: Connect to MongoDB
    console.log("\n🔗 Step 1: Connecting to MongoDB...");
    await mongoose.connect(MONGOURL);
    console.log("✅ MongoDB connected successfully");

    // Step 2: Clear existing data (optional)
    console.log("\n🧹 Step 2: Clearing existing test data...");
    await userModel.deleteMany({ email: { $in: ["test@test.com", "admin@test.com"] } });
    console.log("✅ Test data cleared");

    // Step 3: Create test users
    console.log("\n👥 Step 3: Creating test users...");
    
    const testUser = new userModel({
      name: "Test Student",
      email: "test@test.com",
      role: "student"
    });
    await testUser.save();
    console.log("✅ Test student created:", testUser.email);

    const adminUser = new userModel({
      name: "Test Admin",
      email: "admin@test.com",
      role: "admin"
    });
    await adminUser.save();
    console.log("✅ Test admin created:", adminUser.email);

    // Step 4: Test JWT functionality
    console.log("\n🔑 Step 4: Testing JWT functionality...");
    const token = jwt.sign(
      { id: testUser._id, email: testUser.email, role: testUser.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("✅ JWT token generated");
    
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ JWT token verified");
    console.log("Decoded payload:", decoded);

    // Step 5: Test database queries
    console.log("\n📊 Step 5: Testing database queries...");
    const allUsers = await userModel.find();
    console.log(`✅ Found ${allUsers.length} users in database`);
    
    const student = await userModel.findOne({ email: "test@test.com" });
    console.log("✅ Student query successful:", student.name);

    const admin = await userModel.findOne({ email: "admin@test.com" });
    console.log("✅ Admin query successful:", admin.name);

    console.log("\n🎉 Setup completed successfully!");
    console.log("\n📝 Test Credentials:");
    console.log("Student - Email: test@test.com, Role: student");
    console.log("Admin - Email: admin@test.com, Role: admin");
    console.log("Password: (any password for Firebase)");
    
    console.log("\n🔗 Test URLs:");
    console.log("Server test: http://localhost:8000/api/test");
    console.log("Health check: http://localhost:8000/api/health");
    
    console.log("\n💡 Next steps:");
    console.log("1. Start the server: node index.js");
    console.log("2. Start the frontend: npm run dev (in zeroday- folder)");
    console.log("3. Login with test@test.com or admin@test.com");

  } catch (error) {
    console.error("❌ Setup failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

setup(); 