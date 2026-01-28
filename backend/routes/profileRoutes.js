import express from "express";
import { getProfileSummary } from "../controller/profileController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// GET /api/profile/summary
router.get("/summary", authMiddleware, getProfileSummary);

export default router;
