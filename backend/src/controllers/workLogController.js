import prisma from '../config/database.js';

export async function getWorkLogsByJobCard(req, res) {
  const jobCardId = Number(req.params.id);

  const logs = await prisma.workLog.findMany({
    where: { jobCardId },
    orderBy: { createdAt: "desc" },
  });

  res.json(logs);
}

export async function createWorkLog(req, res) {
  const jobCardId = Number(req.params.id);
  const { taskName, technicianName } = req.body;

  const jobCard = await prisma.jobCard.findUnique({
    where: { id: jobCardId },
  });

  if (!jobCard) {
    return res.status(404).json({ error: 'JobCard not found' });
  }

  const log = await prisma.workLog.create({
    data: {
      jobCardId,
      taskName,
      technicianName,
      status: "PENDING"
    },
  });

  res.status(201).json(log);
}

export async function startWorkLog(req, res) {
  const id = Number(req.params.id);

  const log = await prisma.workLog.findUnique({ where: { id } });
  if (!log) {
    return res.status(404).json({ error: 'WorkLog not found' });
  }

  const updated = await prisma.workLog.update({
    where: { id },
    data: { status: "IN_PROGRESS", startedAt: new Date() },
  });

  res.json(updated);
}

export async function completeWorkLog(req, res) {
  const id = Number(req.params.id);

  const log = await prisma.workLog.findUnique({ where: { id } });
  if (!log) {
    return res.status(404).json({ error: 'WorkLog not found' });
  }

  if (log.status !== "IN_PROGRESS") {
    return res.status(400).json({ error: "Task must be in IN_PROGRESS status to complete." });
  }

  const updated = await prisma.workLog.update({
    where: { id },
    data: { status: "COMPLETED", completedAt: new Date() },
  });

  res.json(updated);
}
