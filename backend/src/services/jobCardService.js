import fs from 'fs';
import path from 'path';
import prisma from '../config/database.js';

const JOB_CARD_PREFIX = 'JC';

// ----------------------------------
// Generate Job Card Number
// ----------------------------------
const generateJobCardNumber = async () => {
  const count = await prisma.jobCard.count();
  return `${JOB_CARD_PREFIX}-${String(count + 1).padStart(6, '0')}`;
};

// ----------------------------------
// Create job card (safe)
// ----------------------------------
export const createJobCard = async (input) => {
  const jobCardNumber = await generateJobCardNumber();

  // Handle both old format (customer/vehicle) and new format (customerData/vehicleData)
  const customerData = input.customerData || input.customer;
  const vehicleData = input.vehicleData || input.vehicle;

  // Create or connect customer
  const customer = await prisma.customer.upsert({
    where: { mobileNumber: customerData.mobileNumber },
    update: { name: customerData.name },
    create: {
      name: customerData.name,
      mobileNumber: customerData.mobileNumber,
    },
  });

  // Create or connect vehicle
  const vehicle = await prisma.vehicle.upsert({
    where: { vinNumber: vehicleData.vinNumber },
    update: { model: vehicleData.model },
    create: {
      vinNumber: vehicleData.vinNumber,
      model: vehicleData.model,
      customerId: customer.id,
    },
  });

  return prisma.jobCard.create({
    data: {
      customerId: customer.id,
      vehicleId: vehicle.id,
      serviceAdvisorId: input.serviceAdvisorId,
      serviceInDatetime: new Date(input.serviceInDatetime),
      serviceType: input.serviceType,
      remarks: input.remarks,
      jobCardNumber,
      status: input.status || 'OPEN',
    },
    include: {
      customer: true,
      vehicle: true,
      advisor: true,
    },
  });
};

// ----------------------------------
// Delete job card safely
// ----------------------------------
export const deleteJobCard = async (id) => {
  const jobCardId = Number(id);

  return prisma.$transaction(async (tx) => {
    const jobCard = await tx.jobCard.findUnique({ where: { id: jobCardId } });
    if (!jobCard) throw new Error('Job card not found');

    if (jobCard.status !== 'OPEN') {
      throw new Error('Only OPEN job cards can be deleted');
    }

    const media = await tx.jobCardMedia.findMany({
      where: { jobCardId },
    });

    for (const m of media) {
      const filePath = path.join(process.cwd(), m.filePath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await tx.jobCard.delete({ where: { id: jobCardId } });

    const dir = path.join(process.cwd(), 'uploads', 'job-cards', String(jobCardId));
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });

    return true;
  });
};

// ----------------------------------
// Search job cards
// ----------------------------------
export const searchJobCards = async (filters) => {
  const { mobile, vin, status, fromDate, toDate } = filters;

  return prisma.jobCard.findMany({
    where: {
      status: status || undefined,
      createdAt:
        fromDate || toDate
          ? {
              gte: fromDate ? new Date(fromDate) : undefined,
              lte: toDate ? new Date(toDate) : undefined,
            }
          : undefined,
      customer: mobile
        ? { mobileNumber: { contains: mobile, mode: 'insensitive' } }
        : undefined,
      vehicle: vin
        ? { vinNumber: { contains: vin, mode: 'insensitive' } }
        : undefined,
    },
    include: {
      customer: true,
      vehicle: true,
      advisor: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

// ----------------------------------
// Update status safely
// ----------------------------------
export const updateJobCardStatus = async (id, newStatus) => {
  const jobCardId = Number(id);

  return prisma.$transaction(async (tx) => {
    const jobCard = await tx.jobCard.findUnique({ where: { id: jobCardId } });
    if (!jobCard) throw new Error('Job card not found');

    const transitions = {
      OPEN: ['IN_PROGRESS'],
      IN_PROGRESS: ['CLOSED'],
      CLOSED: [],
    };

    if (!transitions[jobCard.status].includes(newStatus)) {
      throw new Error(`Invalid status transition from ${jobCard.status} to ${newStatus}`);
    }

    return tx.jobCard.update({
      where: { id: jobCardId },
      data: {
        status: newStatus,
        closedAt: newStatus === 'CLOSED' ? new Date() : undefined,
      },
    });
  });
};
