import express from "express";
import prisma from "../prisma/client.js";

const router = express.Router();

router.get("/:vehicleNumber", async (req, res) => {
  try {
    const raw = req.params.vehicleNumber;

    // 🔥 normalize input
    const clean = String(raw).trim();

    // 🔥 convert to number then back to padded string
    const numeric = parseInt(clean, 10);
    const formattedVIN = String(numeric).padStart(3, "0");

    console.log("INPUT:", clean);
    console.log("FORMATTED:", formattedVIN);

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        vinNumber: formattedVIN,
      },
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    return res.json(vehicle);

  } catch (err) {
    console.error("Vehicle lookup error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;