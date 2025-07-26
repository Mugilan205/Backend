import express from "express";
import { loginWithFirebase, signup } from "../controller/authController.js";
const router = express.Router();

router.post("/login", loginWithFirebase);
router.post("/signup", signup);

export default router;
