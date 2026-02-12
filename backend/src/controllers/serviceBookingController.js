import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

/* =====================================================
   CUSTOMER: CREATE SERVICE BOOKING (Instant Confirm)
===================================================== */
export const createServiceBooking = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { vehiclePart, serviceType, preferredDate, timeSlot, notes } = req.body;

    if (!vehiclePart || !serviceType || !preferredDate || !timeSlot) {
      return res.status(400).json({
        error: "All required fields must be provided",
      });
    }

    // 🔒 Create booking (unique constraint prevents double slot booking)
    const booking = await prisma.serviceBooking.create({
      data: {
        customerId,
        vehiclePart,
        serviceType,
        preferredDate: new Date(preferredDate),
        timeSlot,
        notes: notes || null,
        status: "CONFIRMED",
      },
    });

    // 🔥 Auto-create Job Card
    const jobCard = await prisma.jobCard.create({
      data: {
        jobCardNumber: `JC-${Date.now()}`,
        customerId: booking.customerId,
        vehicleId: 1, // Replace later with real vehicle logic
        serviceType: booking.serviceType,
        serviceInDatetime: booking.preferredDate,
        status: "OPEN",
        remarks: booking.notes || "",
      },
    });

    // 🔗 Link job card to booking
    await prisma.serviceBooking.update({
      where: { id: booking.id },
      data: { jobCardId: jobCard.id },
    });

    return res.status(201).json({
      message: "Booking confirmed",
      bookingId: booking.id,
      jobCardId: jobCard.id,
    });

  } catch (error) {

    // 🚫 Slot already booked
    if (error.code === "P2002") {
      return res.status(400).json({
        error: "This time slot is already booked",
      });
    }

    console.error("Create booking error:", error);

    return res.status(500).json({
      error: "Failed to create service booking",
    });
  }
};


/* =====================================================
   CUSTOMER: GET MY BOOKINGS
===================================================== */
export const getMyServiceBookings = async (req, res) => {
  try {
    const bookings = await prisma.serviceBooking.findMany({
      where: { customerId: req.user.id },
      include: {
        jobCard: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json(bookings);

  } catch (error) {
    console.error("Fetch my bookings error:", error);
    return res.status(500).json({
      error: "Failed to fetch bookings",
    });
  }
};


/* =====================================================
   ADMIN: GET ALL BOOKINGS
===================================================== */
export const getAllServiceBookings = async (req, res) => {
  try {
    const bookings = await prisma.serviceBooking.findMany({
      include: {
        customer: true,
        jobCard: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json(bookings);

  } catch (error) {
    console.error("Fetch all bookings error:", error);
    return res.status(500).json({
      error: "Failed to fetch service bookings",
    });
  }
};
