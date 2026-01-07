import { addComplaints } from '../services/complaintService.js';

export const createComplaints = async (req, res) => {
  const { id } = req.params;
  const complaints = req.body;

  if (!Array.isArray(complaints) || complaints.length === 0) {
    return res.status(400).json({ error: 'Complaints required' });
  }

  await addComplaints(id, complaints);

  res.status(201).json({ message: 'Complaints added' });
};
