import prisma from "../prisma/client.js";

export const getWorkLogs = async (req, res) => {
  const jobCardId = Number(req.params.id);

  const logs = await prisma.workLog.findMany({
    where: { jobCardId },
    orderBy: { createdAt: "desc" }
  });

  res.json(logs);
};

export const addWorkLog = async (req, res) => {
  const jobCardId = Number(req.params.id);
  const { description } = req.body;

  const log = await prisma.workLog.create({
    data: { jobCardId, description }
  });

  res.json(log);
};
