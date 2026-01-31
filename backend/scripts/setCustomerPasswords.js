import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
  const hash = await bcrypt.hash("customer@123", 10);

  await prisma.customer.updateMany({
    where: { passwordHash: null },
    data: { passwordHash: hash },
  });

  console.log("Customer passwords set to customer@123");
  process.exit();
}

run();
