import * as jobCardService from '../services/jobCardService.js';

// POST /job-cards
export const createJobCard = async (req, res) => {
  try {
    if (!['ADMIN', 'ADVISOR'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    console.log("CREATE JOB CARD PAYLOAD:", req.body);

    const jobCard = await jobCardService.createJobCard({
      ...req.body,
      serviceAdvisorId: req.user.id,
    });

    res.status(201).json(jobCard);
  } catch (err) {
    console.error("CREATE JOB CARD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET /job-cards/:id
export const getJobCard = async (req, res) => {
  try {
    const jobCard = await jobCardService.getJobCardById(req.params.id);
    if (!jobCard) return res.status(404).json({ error: 'Not found' });
    res.json(jobCard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /job-cards/:id/status
export const updateJobStatus = async (req, res) => {
  try {
    if (!['ADMIN', 'TECHNICIAN'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { status } = req.body;
    const updated = await jobCardService.updateJobCardStatus(req.params.id, status);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /job-cards/search
export const searchJobCards = async (req, res) => {
  try {
    const results = await jobCardService.searchJobCards(req.query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
