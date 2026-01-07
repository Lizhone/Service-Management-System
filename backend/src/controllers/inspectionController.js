import * as inspectionService from '../services/inspectionService.js';

const ALLOWED_CONDITIONS = ['OK', 'NOT_OK', 'DAMAGE'];

// POST /job-cards/:id/inspection
export const addInspection = async (req, res) => {
  try {
    const { id } = req.params;
    const items = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Inspection list required' });
    }

    for (const item of items) {
      if (
        !item.componentName ||
        !ALLOWED_CONDITIONS.includes(item.condition)
      ) {
        return res.status(400).json({ error: 'Invalid inspection item' });
      }
    }

    await inspectionService.addInspection(id, items);
    res.status(201).json({ message: 'Inspection saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /job-cards/:id/inspection
export const getInspection = async (req, res) => {
  try {
    const { id } = req.params;
    const inspection = await inspectionService.getInspectionByJobCard(id);
    res.json(inspection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
