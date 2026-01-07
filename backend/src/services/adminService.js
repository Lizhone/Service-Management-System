import prisma from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

// Login admin
export const loginAdmin = async (username, password) => {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  const admin = await prisma.admin.findUnique({
    where: { username },
  });

  if (!admin) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return {
    token,
    admin: {
      id: admin.id,
      username: admin.username,
    },
  };
};

// Create admin (for initial setup)
export const createAdmin = async (username, password) => {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { username },
  });

  if (existingAdmin) {
    throw new Error('Admin with this username already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.create({
    data: {
      username,
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
      createdAt: true,
    },
  });

  return admin;
};

