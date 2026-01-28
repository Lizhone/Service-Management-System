import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const customerLogin = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    if (!mobileNumber || !password) {
      return res.status(400).json({ error: "Mobile number and password are required" });
    }

    const customer = await prisma.customer.findUnique({ where: { mobileNumber } });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    if (!customer.passwordHash) {
      return res.status(400).json({ error: "Password not set for this customer" });
    }

    const match = await bcrypt.compare(password, customer.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: customer.id, role: "CUSTOMER" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: customer.id,
        name: customer.name,
        role: "CUSTOMER",
        mobileNumber: customer.mobileNumber
      }
    });
  } catch (err) {
    console.error("CUSTOMER LOGIN ERROR:", err);
    return res.status(500).json({ error: "Internal error" });
  }
};
