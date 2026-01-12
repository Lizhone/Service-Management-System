import * as inspectionService from "../services/inspectionService.js";

const ALLOWED_CONDITIONS = ["OK", "NOT_OK", "DAMAGE"];

// POST /job-cards/:id/inspection
export const addInspection = async (req, res) => {
  try {
    const jobCardId = Number(req.params.id);
    const items = req.body;

    if (!jobCardId || Number.isNaN(jobCardId)) {
      return res.status(400).json({ error: "Invalid job card id" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Inspection list required" });
    }

    for (const item of items) {
      if (
        typeof item.componentName !== "string" ||
        !ALLOWED_CONDITIONS.includes(item.condition)
      ) {
        return res.status(400).json({
          error: "Each inspection must have componentName and valid condition",
        });
      }
    }

    await inspectionService.addInspection(jobCardId, items);

    res.status(201).json({ message: "Inspection saved successfully" });
  } catch (err) {
    console.error("Inspection error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET /job-cards/:id/inspection
export const getInspection = async (req, res) => {
  try {
    const jobCardId = Number(req.params.id);

    if (!jobCardId || Number.isNaN(jobCardId)) {
      return res.status(400).json({ error: "Invalid job card id" });
    }

    const inspection = await inspectionService.getInspectionByJobCard(jobCardId);
    res.json(inspection);
  } catch (err) {
    console.error("Fetch inspection error:", err);
    res.status(500).json({ error: err.message });
  }
};
