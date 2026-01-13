export const addComplaint = async (req, res) => {
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
    console.error("Add complaint failed:", err);
    res.status(500).json({ error: err.message });
  }
};
