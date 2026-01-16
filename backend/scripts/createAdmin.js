import bcrypt from 'bcrypt';
import prisma from '../src/config/database.js';

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
      where: { email: 'admin@service.com' },
      update: {},
      create: {
        name: 'Admin',
        email: 'admin@service.com',
        passwordHash: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('Admin user created:', admin.email);
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
