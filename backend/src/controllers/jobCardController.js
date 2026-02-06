import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

/* ================================
   CONSTANTS
================================ */
const ALLOWED_SERVICE_TYPES = [
  "GENERAL",
  "COMPLAINT",
  "BATTERY",
  "CHARGER",
  "PAID_SERVICE_REPAIRABLE",
  "PAID_SERVICE_WARRANTY",
  "SPARES_DISPATCH",
];

/* ================================
   HELPERS
================================ */
function isValidServiceType(value) {
  return ALLOWED_SERVICE_TYPES.includes(value);
}

function parseDateOrFail(value) {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d;
}

/* ================================
   CREATE JOB CARD
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

    if (!isValidServiceType(serviceType)) {
      return res.status(400).json({
        error: `Invalid serviceType: ${serviceType}`,
      });
    }

    const parsedDate = parseDateOrFail(serviceInDatetime);
    if (!parsedDate) {
      return res.status(400).json({
        error: "Valid serviceInDatetime is required",
      });
    }

    const jobCard = await prisma.jobCard.create({
      data: {
        jobCardNumber: `JC-${Date.now()}`,
        customerId: Number(customerId),
        vehicleId: Number(vehicleId),
        serviceType,
        status: "OPEN",
        serviceInDatetime: parsedDate,
        remarks: remarks || null,
      },
    });

    return res.status(201).json(jobCard);
  } catch (error) {
    console.error("Create job card failed:", error);
    return res.status(500).json({ error: "Failed to create job card" });
  }
};

/* ================================
   CREATE JOB CARD WITH DETAILS
================================ */
export const createJobCardWithDetails = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      vin,
      vehicleModel,
      customerId,
      vehicleId,
      serviceType,
      serviceInDatetime,
      remarks,
    } = req.body;

    if (!isValidServiceType(serviceType)) {
      return res.status(400).json({ error: "Invalid serviceType" });
    }

    const parsedDate = parseDateOrFail(serviceInDatetime);
    if (!parsedDate) {
      return res.status(400).json({
        error: "Valid serviceInDatetime is required",
      });
    }

    let finalCustomerId = customerId;
    let finalVehicleId = vehicleId;

    if (!finalCustomerId) {
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

    if (!finalVehicleId) {
      let vehicle = await prisma.vehicle.findUnique({
        where: { vinNumber: vin },
      });

      if (!vehicle) {
        vehicle = await prisma.vehicle.create({
          data: {
            vinNumber: vin,
            model: vehicleModel,
            customerId: finalCustomerId,
          },
        });
      }

      finalVehicleId = vehicle.id;
    }

    const jobCard = await prisma.jobCard.create({
      data: {
        jobCardNumber: `JC-${Date.now()}`,
        customerId: finalCustomerId,
        vehicleId: finalVehicleId,
        serviceType,
        status: "OPEN",
        serviceInDatetime: parsedDate,
        remarks: remarks || null,
      },
    });

    return res.status(201).json(jobCard);
  } catch (error) {
    console.error("createJobCardWithDetails failed:", error);
    return res.status(500).json({ error: "Failed to create job card" });
  }
};

/* ================================
   GET SINGLE JOB CARD ✅ FINAL
================================ */
export const getJobCard = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const jobCard = await prisma.jobCard.findUnique({
      where: { id },
      include: {
        customer: true,
        vehicle: true,

        // 🔥 REAL PRISMA RELATION
        complaints: {
          orderBy: { createdAt: "desc" },
        },

        inspections: true,
        parts: true,
        workLogs: true,
        media: true,
      },
    });

    if (!jobCard) {
      return res.status(404).json({ error: "Job card not found" });
    }

    // 🔥 NORMALIZED RESPONSE FOR FRONTEND
    return res.json({
      ...jobCard,
      serviceComplaints: jobCard.complaints, // 👈 THIS MAKES UI WORK
    });
  } catch (error) {
    console.error("Fetch job card failed:", error);
    return res.status(500).json({ error: "Failed to fetch job card" });
  }
};

/* ================================
   UPDATE JOB CARD
================================ */
export const updateJobCard = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = { ...req.body };

    if (data.serviceType && !isValidServiceType(data.serviceType)) {
      return res.status(400).json({ error: "Invalid serviceType" });
    }

    if (data.serviceInDatetime) {
      const parsedDate = parseDateOrFail(data.serviceInDatetime);
      if (!parsedDate) {
        return res.status(400).json({ error: "Invalid serviceInDatetime" });
      }
      data.serviceInDatetime = parsedDate;
    }

    const jobCard = await prisma.jobCard.update({
      where: { id },
      data,
    });

    return res.json(jobCard);
  } catch (error) {
    console.error("Update job card failed:", error);
    return res.status(500).json({ error: "Failed to update job card" });
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
    return res.status(500).json({ error: "Failed to update job status" });
  }
};

/* ================================
   DELETE JOB CARD
================================ */
export const deleteJobCard = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.jobCard.delete({ where: { id } });
    return res.json({ success: true });
  } catch (error) {
    console.error("Delete job card failed:", error);
    return res.status(500).json({ error: "Failed to delete job card" });
  }
};

/* ================================
   JOB CARD HISTORY BY CUSTOMER
================================ */
export const getJobCardHistoryByCustomer = async (req, res) => {
  try {
    const customerId = Number(req.params.customerId);

    if (!customerId || Number.isNaN(customerId)) {
      return res.status(400).json({ error: "Invalid customer ID" });
    }

    const jobCards = await prisma.jobCard.findMany({
      where: { customerId },
      include: { vehicle: true },
      orderBy: { createdAt: "desc" },
    });

    return res.json(jobCards);
  } catch (error) {
    console.error("Job card history fetch failed:", error);
    return res.status(500).json({ error: "Failed to fetch job card history" });
  }
};
