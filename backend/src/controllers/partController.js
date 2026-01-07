import { addParts } from '../services/partService.js';

export const createParts = async (req, res) => {
  const { id } = req.params;
  const parts = req.body;

  if (!Array.isArray(parts) || parts.length === 0) {
    return res.status(400).json({ error: 'Parts required' });
  }

  await addParts(id, parts);

  res.status(201).json({ message: 'Parts added' });
};
