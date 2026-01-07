import bcrypt from 'bcrypt';
import prisma from '../src/config/database.js';

console.log('\n=== Create Admin User ===\n');

async function createAdmin() {
  const email = 'admin@service.com';
  const password = 'admin123';

  // Check if admin already exists
  const existing = await prisma.user.findMany({
    where: { email },
  });

  if (existing.length > 0) {
    console.log('⚠️ Admin already exists:', email);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email,
      passwordHash,
      role: 'ADMIN',
      active: true,
    },
  });

  console.log('✅ Admin created successfully');
  console.log('   Email:', admin.email);
}

createAdmin()
  .catch((err) => {
    console.error('\n❌ Error creating admin:\n ', err.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
