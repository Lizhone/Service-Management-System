import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

/* ================================
   CREATE JOB CARD (BASIC – EXISTING FLOW)
================================ */
export const createJobCard = async (req, res) => {
  try {
    const {
      customerId,
      vehicleId,
      serviceType,
      serviceInDatetime,
      remarks,
    } = req.body;

    if (!customerId || !vehicleId || !serviceType) {
      return res.status(400).json({
        error: "customerId, vehicleId and serviceType are required",
      });
    }

    // ✅ REQUIRED: jobCardNumber
    const jobCardNumber = `JC-${Date.now()}`;

    const jobCard = await prisma.jobCard.create({
      data: {
        jobCardNumber,
        customerId,
        vehicleId,
        serviceType,
        status: "OPEN",
        serviceInDatetime: serviceInDatetime
          ? new Date(serviceInDatetime)
          : null,
        remarks: remarks || null,
      },
    });

    return res.status(201).json(jobCard);
  } catch (error) {
    console.error("Create job card failed:", error);
    return res.status(500).json({
      error: "Failed to create job card",
    });
  }
};

/* ======================================================
   CREATE JOB CARD WITH DETAILS (NEW CUSTOMER / VEHICLE)
   ✅ FIXED
   ✅ NO SCHEMA CHANGE
   ✅ ADMIN SAFE
====================================================== */
export const createJobCardWithDetails = async (req, res) => {
  try {
    const {
      // NEW MODE
      customerName,
      customerPhone,
      vin,
      vehicleModel,

      // EXISTING MODE
      customerId,
      vehicleId,

      // COMMON
      serviceType,
      serviceInDatetime,
      remarks,
    } = req.body;

    if (!serviceType) {
      return res.status(400).json({
        error: "Service type is required",
      });
    }

    let finalCustomerId = customerId;
    let finalVehicleId = vehicleId;

    /* ===============================
       CUSTOMER HANDLING
    =============================== */
    if (!finalCustomerId) {
      if (!customerName || !customerPhone) {
        return res.status(400).json({
          error: "Customer name and phone are required",
        });
      }

      let customer = await prisma.customer.findUnique({
        where: { mobileNumber: customerPhone },
      });

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: customerName,
            mobileNumber: customerPhone,
          },
        });
      }

      finalCustomerId = customer.id;
    }

    /* ===============================
       VEHICLE HANDLING
    =============================== */
    if (!finalVehicleId) {
      if (!vin || !vehicleModel) {
        return res.status(400).json({
          error: "VIN and vehicle model are required",
        });
      }

      const vehicle = await prisma.vehicle.create({
        data: {
          vinNumber: vin,
          model: vehicleModel,
          customerId: finalCustomerId,
        },
      });

      finalVehicleId = vehicle.id;
    }

    /* ===============================
       CREATE JOB CARD (FINAL FIX)
    =============================== */
    const jobCardNumber = `JC-${Date.now()}`;

    const jobCard = await prisma.jobCard.create({
      data: {
        jobCardNumber, // ✅ REQUIRED FIELD (FIX)
        customerId: finalCustomerId,
        vehicleId: finalVehicleId,
        serviceType,
        status: "OPEN",
        serviceInDatetime: serviceInDatetime
          ? new Date(serviceInDatetime)
          : null,
        remarks: remarks || null,
      },
    });

    return res.status(201).json(jobCard);
  } catch (error) {
    console.error("createJobCardWithDetails failed:", error);
    return res.status(500).json({
      error: "Failed to create job card",
    });
  }
};

/* ================================
   GET SINGLE JOB CARD
================================ */
export const getJobCard = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const jobCard = await prisma.jobCard.findUnique({
      where: { id },
      include: {
        customer: true,
        vehicle: true,
      },
    });

    if (!jobCard) {
      return res.status(404).json({
        error: "Job card not found",
      });
    }

    return res.json(jobCard);
  } catch (error) {
    console.error("Fetch job card failed:", error);
    return res.status(500).json({
      error: "Failed to fetch job card",
    });
  }
};

/* ================================
   UPDATE JOB CARD
================================ */
export const updateJobCard = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const jobCard = await prisma.jobCard.update({
      where: { id },
      data: req.body,
    });

    return res.json(jobCard);
  } catch (error) {
    console.error("Update job card failed:", error);
    return res.status(500).json({
      error: "Failed to update job card",
    });
  }
};

/* ================================
   UPDATE JOB STATUS
================================ */
export const updateJobStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const jobCard = await prisma.jobCard.update({
      where: { id },
      data: { status },
    });

    return res.json(jobCard);
  } catch (error) {
    console.error("Update job status failed:", error);
    return res.status(500).json({
      error: "Failed to update job status",
    });
  }
};

/* ================================
   DELETE JOB CARD
================================ */
export const deleteJobCard = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.jobCard.delete({
      where: { id },
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Delete job card failed:", error);
    return res.status(500).json({
      error: "Failed to delete job card",
    });
  }
};

/* ================================
   JOB CARD HISTORY BY CUSTOMER
================================ */
export const getJobCardHistoryByCustomer = async (req, res) => {
  try {
    const customerId = Number(req.params.customerId);

    if (!customerId || Number.isNaN(customerId)) {
      return res.status(400).json({
        error: "Invalid customer ID",
      });
    }

    const jobCards = await prisma.jobCard.findMany({
      where: { customerId },
      include: { vehicle: true },
      orderBy: { createdAt: "desc" },
    });

    return res.json(jobCards);
  } catch (error) {
    console.error("Job card history fetch failed:", error);
    return res.status(500).json({
      error: "Failed to fetch job card history",
    });
  }
};
