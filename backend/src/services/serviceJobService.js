import prisma from '../config/database.js';
import { deleteImageFile } from '../config/multer.js';

// Get all service jobs
export const getAllServiceJobs = async () => {
  return await prisma.serviceJob.findMany({
    include: {
      vehicle: {
        include: {
          customer: true,
        },
      },
      images: true,
    },
  });
};

// Get service job by ID
export const getServiceJobById = async (id) => {
  const serviceJob = await prisma.serviceJob.findUnique({
    where: { id: parseInt(id) },
    include: {
      vehicle: {
        include: {
          customer: true,
        },
      },
      images: true,
    },
  });

  if (!serviceJob) {
    throw new Error('Service job not found');
  }

  return serviceJob;
};

// Get service jobs by vehicle ID (using Prisma relation)
export const getServiceJobsByVehicleId = async (vehicleId) => {
  // Verify vehicle exists
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: parseInt(vehicleId) },
  });

  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  return await prisma.serviceJob.findMany({
    where: { vehicleId: parseInt(vehicleId) },
    include: {
      vehicle: {
        include: {
          customer: true,
        },
      },
      images: true,
    },
  });
};

// Create new service job (linked to vehicle)
export const createServiceJob = async (data) => {
  const { jobCardNo, serviceType, status, odometer, notes, vehicleId, images } = data;

  if (!jobCardNo || !serviceType || !status || !vehicleId) {
    throw new Error('jobCardNo, serviceType, status, and vehicleId are required');
  }

  // Check if vehicle exists (validate relation)
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: parseInt(vehicleId) },
  });

  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  try {
    return await prisma.serviceJob.create({
      data: {
        jobCardNo,
        serviceType,
        status,
        odometer,
        notes,
        vehicleId: parseInt(vehicleId),
        images: images && images.length > 0 ? {
          create: images.map(imageUrl => ({ imageUrl })),
        } : undefined,
      },
      include: {
        vehicle: {
          include: {
            customer: true,
          },
        },
        images: true,
      },
    });
  } catch (error) {
    if (error.code === 'P2002') {
      throw new Error('Job card number already exists');
    }
    throw error;
  }
};

// Update service job
export const updateServiceJob = async (id, data) => {
  const { jobCardNo, serviceType, status, odometer, notes, vehicleId } = data;

  // Check if service job exists
  const serviceJob = await prisma.serviceJob.findUnique({
    where: { id: parseInt(id) },
  });

  if (!serviceJob) {
    throw new Error('Service job not found');
  }

  // If vehicleId is being updated, verify vehicle exists (validate relation)
  if (vehicleId) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(vehicleId) },
    });

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
  }

  try {
    return await prisma.serviceJob.update({
      where: { id: parseInt(id) },
      data: {
        jobCardNo,
        serviceType,
        status,
        odometer,
        notes,
        vehicleId: vehicleId ? parseInt(vehicleId) : undefined,
      },
      include: {
        vehicle: {
          include: {
            customer: true,
          },
        },
        images: true,
      },
    });
  } catch (error) {
    if (error.code === 'P2002') {
      throw new Error('Job card number already exists');
    }
    throw error;
  }
};

// Delete service job
export const deleteServiceJob = async (id) => {
  const serviceJob = await prisma.serviceJob.findUnique({
    where: { id: parseInt(id) },
    include: {
      images: true,
    },
  });

  if (!serviceJob) {
    throw new Error('Service job not found');
  }

  // Delete all associated image files from disk
  serviceJob.images.forEach((image) => {
    const filename = image.imageUrl.split('/').pop();
    if (filename) {
      deleteImageFile(filename);
    }
  });

  await prisma.serviceJob.delete({
    where: { id: parseInt(id) },
  });

  return { message: 'Service job deleted successfully' };
};

// Add image to service job
export const addImageToServiceJob = async (serviceJobId, filePath) => {
  if (!filePath) {
    throw new Error('File path is required');
  }

  const serviceJob = await prisma.serviceJob.findUnique({
    where: { id: parseInt(serviceJobId) },
  });

  if (!serviceJob) {
    throw new Error('Service job not found');
  }

  return await prisma.serviceImage.create({
    data: {
      imageUrl: filePath, // Store file path in database
      serviceJobId: parseInt(serviceJobId),
    },
  });
};

// Delete image from service job
export const deleteImageFromServiceJob = async (serviceJobId, imageId) => {
  const serviceJob = await prisma.serviceJob.findUnique({
    where: { id: parseInt(serviceJobId) },
  });

  if (!serviceJob) {
    throw new Error('Service job not found');
  }

  const serviceImage = await prisma.serviceImage.findUnique({
    where: { id: parseInt(imageId) },
  });

  if (!serviceImage || serviceImage.serviceJobId !== parseInt(serviceJobId)) {
    throw new Error('Image not found for this service job');
  }

  // Extract filename from path and delete from disk
  const filename = serviceImage.imageUrl.split('/').pop();
  if (filename) {
    deleteImageFile(filename);
  }

  await prisma.serviceImage.delete({
    where: { id: parseInt(imageId) },
  });

  return { message: 'Image deleted successfully' };
};

