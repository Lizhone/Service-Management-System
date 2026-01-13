import express from "express";
import { addParts, getParts } from "../controllers/partsController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/job-cards/:id/parts", authenticate, addParts);
router.get("/job-cards/:id/parts", authenticate, getParts);

export default router;
