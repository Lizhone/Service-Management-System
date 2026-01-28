import express from "express";
import { customerLogin } from "../controllers/customerAuthController.js";

const router = express.Router();

router.post("/login", customerLogin);

export default router;
