import express from 'express';
import {
  getAllVehicles,
  getVehicleById,
  getVehiclesByCustomerId,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicleController.js';
import { authenticate } from '../middleware/authMiddleware.js';


const router = express.Router();

// Protect all vehicle routes
router.use('/vehicles', authenticate);

router.get('/vehicles', getAllVehicles);
router.get('/vehicles/customer/:customerId', getVehiclesByCustomerId);
router.get('/vehicles/:id', getVehicleById);
router.post('/vehicles', createVehicle);
router.put('/vehicles/:id', updateVehicle);
router.delete('/vehicles/:id', deleteVehicle);

export default router;

