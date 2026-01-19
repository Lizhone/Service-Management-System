import prisma from "../../prisma/client.js";

export const getWorkLogsByJobCard = async (req, res) => {
  try {
    const jobCardId = Number(req.params.id);

    const logs = await prisma.workLog.findMany({
      where: { jobCardId },
      orderBy: { createdAt: "desc" },
    });

    res.json(logs);
  } catch (error) {
    console.error("Fetch work logs failed:", error);
    res.status(500).json({ error: "Failed to fetch work logs" });
  }
};

export const createWorkLog = async (req, res) => {
  try {
    const jobCardId = Number(req.params.id);
    const { taskName, technicianName } = req.body;

    if (!taskName || !technicianName) {
      return res.status(400).json({ error: "taskName and technicianName required" });
    }

    const log = await prisma.workLog.create({
      data: {
        jobCardId,
        taskName,
        technicianName,
      },
    });

    res.status(201).json(log);
  } catch (error) {
    console.error("Create work log failed:", error);
    res.status(500).json({ error: "Failed to create work log" });
  }
};

export const startWorkLog = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const log = await prisma.workLog.findUnique({ where: { id } });
    if (!log) {
      return res.status(404).json({ error: "Work log not found" });
    }

    const updated = await prisma.workLog.update({
      where: { id },
      data: { status: "IN_PROGRESS", startedAt: new Date() },
    });

    res.json(updated);
  } catch (error) {
    console.error("Start work log failed:", error);
    res.status(500).json({ error: "Failed to start work log" });
  }
};

export const completeWorkLog = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const log = await prisma.workLog.findUnique({ where: { id } });
    if (!log) {
      return res.status(404).json({ error: "Work log not found" });
    }

    if (log.status !== "IN_PROGRESS") {
      return res.status(400).json({ error: "Work log must be IN_PROGRESS to complete" });
    }

    const updated = await prisma.workLog.update({
      where: { id },
      data: { status: "COMPLETED", completedAt: new Date() },
    });

    res.json(updated);
  } catch (error) {
    console.error("Complete work log failed:", error);
    res.status(500).json({ error: "Failed to complete work log" });
  }
};
