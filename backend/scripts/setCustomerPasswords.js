import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
  const hash = await bcrypt.hash("customer@123", 10);

  await prisma.customer.updateMany({
    where: { password: null },
    data: { password: hash },
  });

  console.log("Passwords set");
  await prisma.$disconnect();
  process.exit(0);
}

run().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
