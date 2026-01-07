import * as vehicleService from '../services/vehicleService.js';

// Get all vehicles
export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get vehicle by ID
export const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await vehicleService.getVehicleById(id);
    res.status(200).json(vehicle);
  } catch (error) {
    if (error.message === 'Vehicle not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// Get vehicles by customer ID (using Prisma relation)
export const getVehiclesByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;
    const vehicles = await vehicleService.getVehiclesByCustomerId(customerId);
    res.status(200).json(vehicles);
  } catch (error) {
    if (error.message === 'Customer not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// Create new vehicle (linked to customer)
export const createVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    if (error.message === 'VIN, model, and customerId are required') {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === 'Customer not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'VIN already exists') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// Update vehicle
export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedVehicle = await vehicleService.updateVehicle(id, req.body);
    res.status(200).json(updatedVehicle);
  } catch (error) {
    if (error.message === 'Vehicle not found' || error.message === 'Customer not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'VIN already exists') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete vehicle
export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await vehicleService.deleteVehicle(id);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Vehicle not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

