import prisma from "../../prisma/client.js";


export const addComplaint = async (jobCardId, description) => {
  return prisma.serviceComplaint.create({
    data: {
      jobCardId: Number(jobCardId),
      description,
    },
  });
};
export const getComplaintsByJobCardId = async (jobCardId) => {
  return prisma.serviceComplaint.findMany({
    where: { jobCardId: Number(jobCardId) },
  });
}
