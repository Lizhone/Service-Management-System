import express from "express";
import { getWorkLogs, addWorkLog } from "../controllers/workLogController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/job-cards/:id/work-log", authenticate, getWorkLogs);
router.post("/job-cards/:id/work-log", authenticate, addWorkLog);

export default router;
