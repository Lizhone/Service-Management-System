import prisma from '../config/database.js';
import { findOrCreateCustomerByMobile } from './customerService.js';
import { findOrCreateVehicleByVIN } from './vehicleService.js';

// Generate daily job card number
const generateJobCardNumber = async () => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const count = await prisma.jobCard.count({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  });

  return `JC-${dateStr}-${String(count + 1).padStart(3, '0')}`;
};

// Create job card
export const createJobCard = async ({
  customerData,
  vehicleData,
  jobCardData,
  advisorId,
}) => {
  const customer = await findOrCreateCustomerByMobile(customerData);
  const vehicle = await findOrCreateVehicleByVIN(vehicleData, customer.id);

  const jobCardNumber = await generateJobCardNumber();

  return prisma.jobCard.create({
    data: {
      jobCardNumber,
      customerId: customer.id,
      vehicleId: vehicle.id,
      serviceAdvisorId: advisorId,
      ...jobCardData,
    },
  });
};

// Get full job card
export const getJobCardById = async (id) => {
  return prisma.jobCard.findUnique({
    where: { id: Number(id) },
    include: {
      customer: true,
      vehicle: true,
      advisor: true,
      inspections: true,
      complaints: true,
      parts: true,
      media: true,
    },
  });
};

// Update job card status
export const updateJobCardStatus = async (id, status) => {
  return prisma.jobCard.update({
    where: { id: Number(id) },
    data: { status },
  });
};

// Close job card
export const closeJobCard = async (id, remarks) => {
  return prisma.jobCard.update({
    where: { id: Number(id) },
    data: {
      status: 'CLOSED',
      remarks,
    },
  });
};

// Search job cards
export const searchJobCards = async (filters) => {
  const {
    jobCardNumber,
    mobileNumber,
    vinNumber,
    status,
    fromDate,
    toDate,
  } = filters;

  return prisma.jobCard.findMany({
    where: {
      jobCardNumber: jobCardNumber ? { contains: jobCardNumber } : undefined,
      status: status || undefined,
      createdAt:
        fromDate || toDate
          ? {
              gte: fromDate ? new Date(fromDate) : undefined,
              lte: toDate ? new Date(toDate) : undefined,
            }
          : undefined,
      customer: mobileNumber
        ? { mobileNumber: { contains: mobileNumber } }
        : undefined,
      vehicle: vinNumber ? { vinNumber: { contains: vinNumber } } : undefined,
    },
    include: {
      customer: true,
      vehicle: true,
      advisor: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};
