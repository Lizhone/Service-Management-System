import express from "express";
import { getMyJobCards } from "../controllers/customerMeController.js";

const router = express.Router();

router.get("/job-cards", getMyJobCards);

export default router;
