import prisma from '../config/database.js';

// Get all customers
export const getAllCustomers = async () => {
  return prisma.customer.findMany({
    include: {
      vehicles: true,
    },
  });
};

// Get customer by ID
export const getCustomerById = async (id) => {
  return prisma.customer.findUnique({
    where: { id: Number(id) },
    include: {
      vehicles: true,
    },
  });
};

// Create new customer
export const createCustomer = async (data) => {
  return prisma.customer.create({
    data,
  });
};

// Update customer
export const updateCustomer = async (id, data) => {
  try {
    return await prisma.customer.update({
      where: { id: Number(id) },
      data,
    });
  } catch {
    return null;
  }
};

// Delete customer
export const deleteCustomer = async (id) => {
  try {
    await prisma.customer.delete({
      where: { id: Number(id) },
    });
    return true;
  } catch {
    return false;
  }
};
