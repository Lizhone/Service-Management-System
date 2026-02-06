import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const customerLogin = async (req, res) => {
  const { mobileNumber, password } = req.body;

  const customer = await prisma.customer.findUnique({
    where: { mobileNumber },
  });

  if (!customer || !customer.passwordHash) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, customer.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { customerId: customer.id, role: "CUSTOMER" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: {
      id: customer.id,
      name: customer.name,
      mobileNumber: customer.mobileNumber,
      role: "CUSTOMER", // 🔥 THIS IS THE KEY
    },
  });
};
