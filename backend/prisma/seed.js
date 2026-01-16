import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      passwordHash,
      role: "ADMIN",
      active: true
    }
  });

  console.log("✅ Admin user created:");
  console.log({
    email: admin.email,
    password: "admin123"
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
