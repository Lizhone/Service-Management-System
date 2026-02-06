import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    if (!mobileNumber || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    // ✅ mobileNumber is STRING in Prisma schema
    const mobile = String(mobileNumber).trim();

    const customer = await req.prisma.customer.findUnique({
      where: {
        mobileNumber: mobile, // ✅ STRING, NOT BigInt
      },
    });

    if (!customer) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!customer.passwordHash) {
      return res.status(500).json({ message: "Customer password not set" });
    }

    const isMatch = await bcrypt.compare(password, customer.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        customerId: customer.id,
        role: "CUSTOMER",
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    res.json({
  token,
  customer: {
    id: customer.id,
    name: customer.name,
    mobileNumber: customer.mobileNumber,
    role: "CUSTOMER",
  },
});

  } catch (err) {
    console.error("CUSTOMER LOGIN ERROR ❌", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
