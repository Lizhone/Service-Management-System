import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const customerLogin = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    if (!mobileNumber || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    // IMPORTANT: mobileNumber must be STRING
    const customer = await prisma.customer.findUnique({
      where: { mobileNumber: String(mobileNumber) },
    });

    if (!customer || !customer.passwordHash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, customer.passwordHash);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: customer.id,
        role: "CUSTOMER",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: customer.id,
        name: customer.name,
        role: "CUSTOMER",
      },
    });
  } catch (err) {
    console.error("Customer login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
