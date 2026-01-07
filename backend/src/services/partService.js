import prisma from '../config/database.js';

export const addParts = async (jobCardId, parts) => {
  return await prisma.partReplacement.createMany({
    data: parts.map(p => ({
      jobCardId: parseInt(jobCardId),
      partName: p.partName,
      partNumber: p.partNumber,
      action: p.action,
      warrantyApplicable: p.warrantyApplicable,
    })),
  });
};
