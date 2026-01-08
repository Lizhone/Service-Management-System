import prisma from '../config/database.js';

// Get all vehicles with pagination
export const getAllVehicles = async (limit = 50, offset = 0) => {
  const vehicles = await prisma.vehicle.findMany({
    take: parseInt(limit),
    skip: parseInt(offset),
    include: {
      customer: true,
      jobCards: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const total = await prisma.vehicle.count();

  return {
    data: vehicles,
    total,
    limit: parseInt(limit),
    offset: parseInt(offset),
  };
};

// Get vehicle by ID
export const getVehicleById = async (id) => {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: parseInt(id) },
    include: {
      customer: true,
      jobCards: true,
    },
  });

  return vehicle || null;
};

// Get vehicles by customer ID
export const getVehiclesByCustomerId = async (customerId) => {
  const customer = await prisma.customer.findUnique({
    where: { id: parseInt(customerId) },
  });

  if (!customer) return null;

  const vehicles = await prisma.vehicle.findMany({
    where: { customerId: parseInt(customerId) },
    include: {
      customer: true,
      jobCards: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return vehicles;
};

// Create new vehicle (linked to customer)
export const createVehicle = async (data) => {
  const {
    vinNumber,
    model,
    registrationNumber,
    batchDetails,
    batteryNumber,
    chargerNumber,
    motorNumber,
    warrantyStatus,
    customerId,
  } = data;

  if (!vinNumber || !model || !customerId) {
    const err = new Error('vinNumber, model, and customerId are required');
    err.code = 'VALIDATION_ERROR';
    throw err;
  }

  const customer = await prisma.customer.findUnique({
    where: { id: parseInt(customerId) },
  });

  if (!customer) {
    const err = new Error('Customer not found');
    err.code = 'P2025';
    throw err;
  }

  try {
    const vehicle = await prisma.vehicle.create({
      data: {
        vinNumber,
        model,
        registrationNumber,
        batchDetails,
        batteryNumber,
        chargerNumber,
        motorNumber,
        warrantyStatus,
        customerId: parseInt(customerId),
      },
      include: {
        customer: true,
        jobCards: true,
      },
    });

    return vehicle;
  } catch (error) {
    throw error;
  }
};

// Update vehicle
export const updateVehicle = async (id, data) => {
  const {
    vinNumber,
    model,
    registrationNumber,
    batchDetails,
    batteryNumber,
    chargerNumber,
    motorNumber,
    warrantyStatus,
    customerId,
  } = data;

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: parseInt(id) },
  });

  if (!vehicle) return null;

  if (customerId) {
    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(customerId) },
    });
    if (!customer) {
      const err = new Error('Customer not found');
      err.code = 'P2025';
      throw err;
    }
  }

  const updated = await prisma.vehicle.update({
    where: { id: parseInt(id) },
    data: {
      ...(vinNumber !== undefined && { vinNumber }),
      ...(model !== undefined && { model }),
      ...(registrationNumber !== undefined && { registrationNumber }),
      ...(batchDetails !== undefined && { batchDetails }),
      ...(batteryNumber !== undefined && { batteryNumber }),
      ...(chargerNumber !== undefined && { chargerNumber }),
      ...(motorNumber !== undefined && { motorNumber }),
      ...(warrantyStatus !== undefined && { warrantyStatus }),
      ...(customerId !== undefined && { customerId: parseInt(customerId) }),
    },
    include: {
      customer: true,
      jobCards: true,
    },
  });

  return updated;
};

// Delete vehicle
export const deleteVehicle = async (id) => {
  await prisma.vehicle.delete({
    where: { id: parseInt(id) },
  });

  return true;
};

