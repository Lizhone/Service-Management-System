import { addComplaint } from '../services/complaintService.js';

// POST /job-cards/:id/complaints
export const createComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    if (!description || typeof description !== "string") {
      return res.status(400).json({ error: "Description is required" });
    }

    await addComplaint(id, description);

    res.status(201).json({ message: "Complaint added successfully" });
  } catch (err) {
    console.error("Complaint error:", err);
    res.status(500).json({ error: "Failed to add complaint" });
  }
};
