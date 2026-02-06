import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

/* ================================
   CUSTOMER: CREATE SERVICE BOOKING
================================ */
export const createServiceBooking = async (req, res) => {
  try {
    const customerId = req.user.id;

    const {
      vehiclePart,
      serviceType,
      preferredDate,
      timeSlot,
      notes,
    } = req.body;

    if (!vehiclePart || !serviceType || !preferredDate || !timeSlot) {
      return res.status(400).json({
        error: "All required fields must be provided",
      });
    }

    const booking = await prisma.serviceBooking.create({
      data: {
        customerId,
        vehiclePart,
        serviceType,
        preferredDate: new Date(preferredDate),
        timeSlot,
        notes: notes || null,
        status: "PENDING",
      },
    });

    return res.status(201).json(booking);
  } catch (error) {
    console.error("Create service booking failed:", error);
    return res.status(500).json({ error: "Failed to create service booking" });
  }
};

/* ================================
   CUSTOMER: GET MY SERVICE BOOKINGS ✅ REQUIRED EXPORT
================================ */
export const getMyServiceBookings = async (req, res) => {
  try {
    const customerId = req.user.id;

    const bookings = await prisma.serviceBooking.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
    });

    return res.json(bookings);
  } catch (error) {
    console.error("Fetch service bookings failed:", error);
    return res.status(500).json({
      error: "Failed to fetch service bookings",
    });
  }
};

/* ================================
   ADMIN: GET ALL BOOKINGS
================================ */
export const getAllServiceBookings = async (req, res) => {
  try {
    const bookings = await prisma.serviceBooking.findMany({
      include: { customer: true },
      orderBy: { createdAt: "desc" },
    });

    return res.json(bookings);
  } catch (error) {
    console.error("Fetch all bookings failed:", error);
    return res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

/* ================================
   ADMIN: APPROVE BOOKING
================================ */
export const approveServiceBooking = async (req, res) => {
  try {
    const bookingId = Number(req.params.id);

    const booking = await prisma.serviceBooking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return res.status(404).json({ error: "Service booking not found" });
    }

    if (booking.status !== "PENDING") {
      return res.status(400).json({
        error: "Booking already processed",
      });
    }

    // Update booking
    await prisma.serviceBooking.update({
      where: { id: bookingId },
      data: { status: "APPROVED" },
    });

    // Auto-create Job Card
    const jobCard = await prisma.jobCard.create({
      data: {
        jobCardNumber: `JC-${Date.now()}`,
        customerId: booking.customerId,
        vehicleId: 1, // TEMP
        serviceType: booking.serviceType,
        serviceInDatetime: booking.preferredDate,
        status: "OPEN",
        remarks: booking.notes || "Auto-created from booking",
      },
    });

    return res.json({
      success: true,
      jobCardId: jobCard.id,
    });
  } catch (error) {
    console.error("Approve booking failed:", error);
    return res.status(500).json({
      error: "Failed to approve booking",
    });
  }
};
