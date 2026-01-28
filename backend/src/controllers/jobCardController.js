import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

/**
 * Create job card with customer and vehicle details
 * 
 * Flow:
 * 1. Validate all required fields
 * 2. Find or create customer by mobileNumber
 * 3. Find or create vehicle by vinNumber (linked to customer)
 * 4. Generate unique jobCardNumber (format: JC-YYYYMMDD-XXXX)
 * 5. Create job card with status OPEN in a transaction
 * 
 * Prisma Schema:
 * - Customer.mobileNumber (unique)
 * - Vehicle.vinNumber (unique)
 * - JobCard.jobCardNumber (unique)
 * - JobCard.status enum: OPEN | IN_PROGRESS | CLOSED
 * - ServiceType enum: GENERAL | PAID | WARRANTY | COMPLAINT | BATTERY | CHARGER
 * 
 * Expected payload:
 * {
 *   serviceType: enum ServiceType,
 *   serviceInDatetime: ISO datetime string,
 *   customerName: string,
 *   customerPhone: string (stored as mobileNumber),
 *   vin: string (stored as vinNumber),
 *   vehicleModel: string,
 *   remarks: string (optional)
 * }
 */
export const createJobCardWithDetails = async (req, res) => {
  try {
    const {
      serviceType,
      serviceInDatetime,
      customerName,
      customerPhone,
      vin,
      vehicleModel,
      remarks,
    } = req.body;

    // 1. Validate required fields
    if (!serviceType || !serviceInDatetime || !customerName || !customerPhone || !vin || !vehicleModel) {
      console.error("Validation failed - missing fields:", {
        serviceType: !!serviceType,
        serviceInDatetime: !!serviceInDatetime,
        customerName: !!customerName,
        customerPhone: !!customerPhone,
        vin: !!vin,
        vehicleModel: !!vehicleModel,
      });
      return res.status(400).json({ 
        message: "Missing required fields",
        required: ["serviceType", "serviceInDatetime", "customerName", "customerPhone", "vin", "vehicleModel"]
      });
    }

    // 2. Validate ServiceType enum
    const validServiceTypes = ["GENERAL", "PAID", "WARRANTY", "COMPLAINT", "BATTERY", "CHARGER"];
    if (!validServiceTypes.includes(serviceType)) {
      console.error("Invalid serviceType:", serviceType);
      return res.status(400).json({ 
        message: `Invalid serviceType. Must be one of: ${validServiceTypes.join(", ")}`
      });
    }

    // 3. Validate and parse date
    const serviceDate = new Date(serviceInDatetime);
    if (isNaN(serviceDate.getTime())) {
      console.error("Invalid date format:", serviceInDatetime);
      return res.status(400).json({ message: "Invalid serviceInDatetime format. Use ISO 8601 format." });
    }

    // 4. Generate unique jobCardNumber (JC-YYYYMMDD-XXXX)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const datePrefix = `JC-${year}${month}${day}`;

    // Count all existing job cards globally to get sequence number
    const existingCount = await prisma.jobCard.count();
    const sequence = String(existingCount + 1).padStart(4, "0");
    const jobCardNumber = `${datePrefix}-${sequence}`;

    console.log("Generating job card:", {
      jobCardNumber,
      customerPhone,
      vin,
      serviceType,
    });

    // 5. Use transaction for atomic operations
    const result = await prisma.$transaction(async (tx) => {
      // Find or create customer by mobileNumber
      let customer = await tx.customer.findUnique({
        where: { mobileNumber: customerPhone },
      });

      if (!customer) {
        console.log("Creating new customer:", customerName, customerPhone);
        customer = await tx.customer.create({
          data: {
            name: customerName,
            mobileNumber: customerPhone,
          },
        });
      } else {
        console.log("Using existing customer:", customer.id, customer.name);
      }

      // Find or create vehicle by vinNumber
      let vehicle = await tx.vehicle.findUnique({
        where: { vinNumber: vin },
      });

      if (!vehicle) {
        console.log("Creating new vehicle:", vin, vehicleModel, "for customer:", customer.id);
        vehicle = await tx.vehicle.create({
          data: {
            vinNumber: vin,
            model: vehicleModel,
            customerId: customer.id,
          },
        });
      } else {
        console.log("Using existing vehicle:", vehicle.id, vehicle.model);
      }

      // Create job card with status OPEN
      const jobCard = await tx.jobCard.create({
        data: {
          jobCardNumber,
          serviceType,
          serviceInDatetime: serviceDate,
          customerId: customer.id,
          vehicleId: vehicle.id,
          status: "OPEN",
          remarks: remarks || null,
        },
        include: {
          customer: true,
          vehicle: true,
        },
      });

      console.log("Created job card:", jobCard.id, jobCard.jobCardNumber);
      return jobCard;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("createJobCardWithDetails error:", {
      message: error.message,
      code: error.code,
      body: req.body,
      stack: error.stack,
    });

    // Handle specific Prisma errors
    if (error.code === "P2002") {
      return res.status(400).json({ 
        message: "Duplicate entry - Phone number or VIN already exists" 
      });
    }
    
    if (error.code === "P2003") {
      return res.status(400).json({ 
        message: "Invalid customer or vehicle reference" 
      });
    }

    res.status(500).json({ 
      message: "Failed to create job card",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

/**
 * Create job card with existing customer and vehicle IDs
 */
export const createJobCard = async (req, res) => {
  try {
    const { customerId, vehicleId, serviceType, serviceInDatetime, remarks } = req.body;

    if (!customerId || !vehicleId) {
      return res.status(400).json({ message: "customerId and vehicleId are required" });
    }

    // Generate job card number in format JC-YYYYMMDD-XXXX (sequence resets daily)
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD

    // Count all existing job cards globally to get sequence number
    const existingCount = await prisma.jobCard.count();
    const sequence = String(existingCount + 1).padStart(4, '0');
    const jobCardNumber = `JC-${dateStr}-${sequence}`;

    // Validate customer and vehicle exist
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });

    if (!customer || !vehicle) {
      return res.status(400).json({ message: "Customer or vehicle not found" });
    }

    const jobCard = await prisma.jobCard.create({
      data: {
        jobCardNumber,
        serviceType,
        serviceInDatetime: new Date(serviceInDatetime),
        customerId,
        vehicleId,
        remarks,
      },
      include: { customer: true, vehicle: true },
    });

    res.status(201).json(jobCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create job card" });
  }
};

/**
 * Get job card by ID with all related data
 */
export const getJobCard = async (req, res) => {
  try {
    const { id } = req.params;

    const jobCard = await prisma.jobCard.findUnique({
      where: { id: parseInt(id) },
      include: {
        customer: true,
        vehicle: true,
        inspections: true,
        complaints: true,
        parts: true,
        media: true,
        workLogs: true,
      },
    });

    if (!jobCard) {
      return res.status(404).json({ message: "Job card not found" });
    }

    res.json(jobCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve job card" });
  }
};

/**
 * Update job card status
 */
export const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const jobCard = await prisma.jobCard.update({
      where: { id: parseInt(id) },
      data: { status },
      include: { customer: true, vehicle: true },
    });

    res.json(jobCard);
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Job card not found" });
    }
    res.status(500).json({ message: "Failed to update job card status" });
  }
};

/**
 * Update job card (CRUD: customerId, vehicleId, serviceType, status, remarks)
 * 
 * Admin can fix customer, vehicle, service type, status, and remarks
 * jobCardNumber and createdAt are immutable
 * 
 * @param {number} id - Job card ID
 * @param {Object} data - Fields to update (customerId, vehicleId, serviceType, status, remarks)
 * @returns {Promise} Updated job card with customer and vehicle data
 */
export const updateJobCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerId, vehicleId, serviceType, status, remarks } = req.body;

    // Validate ID
    if (!id) {
      return res.status(400).json({ message: "Job card ID is required" });
    }

    // Check job card exists
    const jobCard = await prisma.jobCard.findUnique({
      where: { id: parseInt(id) },
    });

    if (!jobCard) {
      return res.status(404).json({ message: "Job card not found" });
    }

    // Build update data - only allow specific fields
    const updateData = {};

    if (customerId !== undefined) {
      updateData.customerId = customerId;
    }
    if (vehicleId !== undefined) {
      updateData.vehicleId = vehicleId;
    }
    if (serviceType !== undefined) {
      updateData.serviceType = serviceType;
    }
    if (status !== undefined) {
      updateData.status = status;
    }
    if (remarks !== undefined) {
      updateData.remarks = remarks;
    }

    // If providing customer or vehicle, validate they exist
    if (customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
      });
      if (!customer) {
        return res.status(400).json({ message: "Customer not found" });
      }
    }

    if (vehicleId) {
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
      });
      if (!vehicle) {
        return res.status(400).json({ message: "Vehicle not found" });
      }
    }

    // Perform update
    const updated = await prisma.jobCard.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { customer: true, vehicle: true },
    });

    res.json(updated);
  } catch (error) {
    console.error("updateJobCard error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Job card not found" });
    }
    if (error.code === "P2003") {
      return res.status(400).json({ message: "Invalid customer or vehicle reference" });
    }
    res.status(500).json({ message: "Failed to update job card" });
  }
};

/**
 * Get job card media by ID
 */
export const getJobCardMediaById = async (req, res) => {
  try {
    const { jobCardId, mediaId } = req.params;

    const media = await prisma.jobCardMedia.findFirst({
      where: {
        id: parseInt(mediaId),
        jobCardId: parseInt(jobCardId),
      },
    });

    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    res.json(media);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve media" });
  }
};

/**
 * Delete job card (soft delete or hard delete)
 * 
 * @param {number} id - Job card ID
 * @returns {Promise} Success response
 */
export const deleteJobCard = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({ message: "Job card ID is required" });
    }

    // Check job card exists
    const jobCard = await prisma.jobCard.findUnique({
      where: { id: parseInt(id) },
    });

    if (!jobCard) {
      return res.status(404).json({ message: "Job card not found" });
    }

    // Delete the job card (Prisma cascade will handle related records)
    await prisma.jobCard.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Job card deleted successfully" });
  } catch (error) {
    console.error("deleteJobCard error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Job card not found" });
    }
    res.status(500).json({ message: "Failed to delete job card" });
  }
};

