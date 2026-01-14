import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getWorkLogsByJobCard(req, res) {
  const jobCardId = Number(req.params.id);

  const logs = await prisma.workLog.findMany({
    where: { jobCardId },
    include: { technician: true },
    orderBy: { createdAt: "desc" },
  });

  res.json(logs);
}

export async function createWorkLog(req, res) {
  const jobCardId = Number(req.params.id);
  const { taskName } = req.body;
  const technicianId = req.user.id;

  const active = await prisma.workLog.findFirst({
    where: { technicianId, status: "ACTIVE" },
  });

  if (active) {
    return res.status(400).json({ error: "You already have an active task." });
  }

  const log = await prisma.workLog.create({
    data: { jobCardId, technicianId, taskName, status: "PENDING" },
  });

  res.status(201).json(log);
}

export async function startWorkLog(req, res) {
  const id = Number(req.params.id);
  const technicianId = req.user.id;

  const log = await prisma.workLog.findUnique({ where: { id } });
  if (!log || log.technicianId !== technicianId) return res.sendStatus(403);

  const active = await prisma.workLog.findFirst({
    where: { technicianId, status: "ACTIVE" },
  });

  if (active) return res.status(400).json({ error: "Finish active task first." });

  const updated = await prisma.workLog.update({
    where: { id },
    data: { status: "ACTIVE", startedAt: new Date() },
  });

  res.json(updated);
}

export async function completeWorkLog(req, res) {
  const id = Number(req.params.id);
  const technicianId = req.user.id;

  const log = await prisma.workLog.findUnique({ where: { id } });
  if (!log || log.technicianId !== technicianId) return res.sendStatus(403);

  if (!log.startedAt) {
    return res.status(400).json({ error: "Task not started yet." });
  }

  const endedAt = new Date();
  const durationMin = Math.round((endedAt - new Date(log.startedAt)) / 60000);

  const updated = await prisma.workLog.update({
    where: { id },
    data: { status: "COMPLETED", endedAt, durationMin },
  });

  res.json(updated);
}
