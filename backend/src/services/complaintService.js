import prisma from '../config/database.js';

export const addComplaints = async (jobCardId, complaints) => {
  return await prisma.serviceComplaint.createMany({
    data: complaints.map(c => ({
      jobCardId: parseInt(jobCardId),
      category: c.category,
      workType: c.workType,
    })),
  });
};
