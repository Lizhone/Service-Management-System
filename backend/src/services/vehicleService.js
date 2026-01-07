import prisma from '../config/database.js';

// Get all vehicles
export const getAllVehicles = async () => {
  return await prisma.vehicle.findMany({
    include: {
      customer: true,
      services: true,
    },
  });
};

// Get vehicle by ID
export const getVehicleById = async (id) => {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: parseInt(id) },
    include: {
      customer: true,
      services: true,
    },
  });

  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  return vehicle;
};

// Get vehicles by customer ID (using Prisma relation)
export const getVehiclesByCustomerId = async (customerId) => {
  // Verify customer exists
  const customer = await prisma.customer.findUnique({
    where: { id: parseInt(customerId) },
  });

  if (!customer) {
    throw new Error('Customer not found');
  }

  return await prisma.vehicle.findMany({
    where: { customerId: parseInt(customerId) },
    include: {
      customer: true,
      services: true,
    },
  });
};

// Create new vehicle (linked to customer)
export const createVehicle = async (data) => {
  const { vin, model, registration, batteryNo, motorNo, customerId } = data;

  if (!vin || !model || !customerId) {
    throw new Error('VIN, model, and customerId are required');
  }

  // Check if customer exists (validate relation)
  const customer = await prisma.customer.findUnique({
    where: { id: parseInt(customerId) },
  });

  if (!customer) {
    throw new Error('Customer not found');
  }

  try {
    return await prisma.vehicle.create({
      data: {
        vin,
        model,
        registration,
        batteryNo,
        motorNo,
        customerId: parseInt(customerId),
      },
      include: {
        customer: true,
      },
    });
  } catch (error) {
    if (error.code === 'P2002') {
      throw new Error('VIN already exists');
    }
    throw error;
  }
};

// Update vehicle
export const updateVehicle = async (id, data) => {
  const { vin, model, registration, batteryNo, motorNo, customerId } = data;

  // Check if vehicle exists
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: parseInt(id) },
  });

  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  // If customerId is being updated, verify customer exists (validate relation)
  if (customerId) {
    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(customerId) },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }
  }

  try {
    return await prisma.vehicle.update({
      where: { id: parseInt(id) },
      data: {
        vin,
        model,
        registration,
        batteryNo,
        motorNo,
        customerId: customerId ? parseInt(customerId) : undefined,
      },
      include: {
        customer: true,
      },
    });
  } catch (error) {
    if (error.code === 'P2002') {
      throw new Error('VIN already exists');
    }
    throw error;
  }
};

// Delete vehicle
export const deleteVehicle = async (id) => {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: parseInt(id) },
  });

  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  await prisma.vehicle.delete({
    where: { id: parseInt(id) },
  });

  return { message: 'Vehicle deleted successfully' };
};

