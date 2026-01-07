import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcryptjs';

async function createAdmin() {
  try {
    // Get username and password from command line arguments
    const username = process.argv[2] || 'admin';
    const password = process.argv[3] || 'admin123';

    console.log('Creating admin user...');
    console.log(`Username: ${username}`);

    // Delete existing admins
    await prisma.admin.deleteMany({});
    console.log('Deleted existing admins.');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
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

    console.log('\n✅ Admin created successfully!');
    console.log(`Username: ${admin.username}`);
    console.log(`Password: ${password}`);
    console.log('\nYou can now login with these credentials.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

