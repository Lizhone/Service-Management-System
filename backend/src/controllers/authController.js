import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';

export const login = async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    console.log("PASSWORD MATCH:", match);

    if (!match) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({ token, user });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Internal error" });
  }
};

/**
 * STAFF LOGIN
 * Authenticates staff (non-customer) users only
 * Rejects CUSTOMER role
 */
export const staffLogin = async (req, res) => {
  try {
    console.log("STAFF LOGIN BODY:", req.body);

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    console.log("STAFF USER FOUND:", user);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // REJECT CUSTOMER ROLE
    if (user.role === "CUSTOMER") {
      return res.status(403).json({ error: "Customers must use customer login" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    console.log("STAFF PASSWORD MATCH:", match);

    if (!match) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({ token, user });
  } catch (err) {
    console.error("STAFF LOGIN ERROR:", err);
    return res.status(500).json({ error: "Internal error" });
  }
};
