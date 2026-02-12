import express from "express";
import {
  createTestRide,
  getAllTestRides,
  getUnviewedTestRideCount,
  markTestRidesAsViewed,
  updateTestRideStatus,
} from "../controllers/testRideController.js";

const router = express.Router();

router.post("/", createTestRide);
router.get("/", getAllTestRides);
router.get("/unviewed-count", getUnviewedTestRideCount);
router.put("/mark-viewed", markTestRidesAsViewed);
router.put("/:id/status", updateTestRideStatus);

export default router;
