import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getMyJobCards = async (req, res) => {
  // req.user.id is set by auth middleware
  const customerId = req.user?.id;
  if (!customerId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const jobCards = await prisma.jobCard.findMany({
    where: { customerId },
    select: {
      id: true,
      jobCardNumber: true,
      status: true,
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ data: jobCards });
};
