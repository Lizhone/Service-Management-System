import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware/authMiddleware.js";

const prisma = new PrismaClient();
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../../uploads/job-cards");

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});



export default router;
