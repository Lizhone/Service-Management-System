import prisma from '../config/database.js';

// Get all customers with pagination
export const getAllCustomers = async (limit = 50, offset = 0) => {
  const customers = await prisma.customer.findMany({
    take: parseInt(limit),
    skip: parseInt(offset),
    include: {
      vehicles: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const total = await prisma.customer.count();

  return {
    data: customers,
    total,
    limit: parseInt(limit),
    offset: parseInt(offset),
  };
};

// Get customer by ID
export const getCustomerById = async (id) => {
  const customer = await prisma.customer.findUnique({
    where: { id: Number(id) },
    include: {
      vehicles: true,
    },
  });

  return customer || null;
};

// Create new customer
export const createCustomer = async (data) => {
  const customer = await prisma.customer.create({
    data: {
      name: data.name,
      mobileNumber: data.mobileNumber,
      address: data.address,
      gstNumber: data.gstNumber,
      notes: data.notes,
    },
    include: {
      vehicles: true,
    },
  });

  return customer;
};

// Update customer
export const updateCustomer = async (id, data) => {
  const customer = await prisma.customer.update({
    where: { id: Number(id) },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.mobileNumber && { mobileNumber: data.mobileNumber }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.gstNumber !== undefined && { gstNumber: data.gstNumber }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
    include: {
      vehicles: true,
    },
  });

  return customer;
};

// Delete customer
export const deleteCustomer = async (id) => {
  await prisma.customer.delete({
    where: { id: Number(id) },
  });

  return true;
};
