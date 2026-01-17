// src/controllers/complaintController.js

export const createComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, category = "GENERAL", workType = "GENERAL" } = req.body;

    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    const complaint = await req.prisma.serviceComplaint.create({
      data: {
        jobCardId: Number(id),
        description,
        category,
        workType,
      },
    });

    res.status(201).json(complaint);
  } catch (err) {
    console.error("Create complaint failed:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getComplaints = async (req, res) => {
  try {
    const { id } = req.params;

    const complaints = await req.prisma.serviceComplaint.findMany({
      where: { jobCardId: Number(id) },
      orderBy: { createdAt: "asc" },
    });

    res.json(complaints);
  } catch (err) {
    console.error("Get complaints failed:", err);
    res.status(500).json({ error: err.message });
  }
};
