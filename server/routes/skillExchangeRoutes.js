import express from "express";
import { createSkillExchange, getAllSkillExchanges, getSkillExchangeById, updateSkillExchange, deleteSkillExchange } from "../controller/skillExchangeController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes for Skill Exchange
router.post("/", verifyToken, createSkillExchange);
router.get("/", verifyToken, getAllSkillExchanges);
router.get("/:id", verifyToken, getSkillExchangeById);
router.put("/:id", verifyToken, updateSkillExchange);
router.delete("/:id", verifyToken, deleteSkillExchange);

export default router;
