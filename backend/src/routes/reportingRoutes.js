import express from 'express';
import {
  getTotalCustomers,
  getTotalVehicles,
  getOpenServiceJobs,
  getRevenueSummary,
  getDashboardSummary,
} from '../controllers/reportingController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all reporting routes
router.use('/reports', authenticate);

router.get('/reports/customers/total', getTotalCustomers);
router.get('/reports/vehicles/total', getTotalVehicles);
router.get('/reports/service-jobs/open', getOpenServiceJobs);
router.get('/reports/revenue', getRevenueSummary);
router.get('/reports/dashboard', getDashboardSummary);

export default router;

