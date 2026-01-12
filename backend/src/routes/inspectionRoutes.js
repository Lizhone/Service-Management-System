import express from "express";
import {
  addInspection,
  getInspection,
} from "../controllers/inspectionController.js";
import { vehicleInspectionSchema } from "../validators/vehicleInspection.schema.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/job-cards/:id/inspection",
  authenticate,
  authorizeRoles("TECHNICIAN", "ADMIN"),
  validate(vehicleInspectionSchema),
  addInspection
);

router.get(
  "/job-cards/:id/inspection",
  authenticate,
  getInspection
);

export default router;
