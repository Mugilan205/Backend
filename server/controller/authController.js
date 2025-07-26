import jwt from "jsonwebtoken";
import userModel from "../Model/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_here";

export const loginWithFirebase = async (req, res) => {
  const { email } = req.body;

  try {
    console.log("🔐 Login attempt for email:", email);
    
    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(404).json({ message: "User not found. Please sign up first." });
    }

    console.log("✅ User found:", user.email, "Role:", user.role);

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("🔑 JWT token generated successfully");

    const response = {
      token,
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    console.log("📤 Sending response:", { ...response, token: "***" });
    res.status(200).json(response);
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

export const signup = async (req, res) => {
  const { name, email, role = "student" } = req.body;

  try {
    console.log("📝 Signup attempt for:", { name, email, role });
    
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new userModel({
      name,
      email,
      role
    });

    await newUser.save();
    console.log("✅ New user created:", newUser.email);

    // Generate token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const response = {
      token,
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    };

    console.log("📤 Sending signup response:", { ...response, token: "***" });
    res.status(201).json(response);
  } catch (err) {
    console.error("❌ Signup error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
