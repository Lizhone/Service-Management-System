import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

/* ================================
   ADVISOR: GET PENDING BOOKINGS
================================ */
export const getAdvisorBookings = async (req, res) => {
  try {
    const bookings = await prisma.serviceBooking.findMany({
      where: {
        status: "PENDING",
        validatedByAdvisorAt: null,
      },
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.json(bookings);
  } catch (error) {
    console.error("Advisor bookings fetch failed:", error);
    return res.status(500).json({
      error: "Failed to fetch advisor bookings",
    });
  }
};

/* ================================
   ADVISOR: VALIDATE BOOKING
================================ */
export const validateServiceBooking = async (req, res) => {
  try {
    const bookingId = Number(req.params.id);
    const { advisorNotes } = req.body;

    if (!advisorNotes || !advisorNotes.trim()) {
      return res.status(400).json({
        error: "Advisor notes are required",
      });
    }

    const booking = await prisma.serviceBooking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return res.status(404).json({
        error: "Service booking not found",
      });
    }

    if (booking.status !== "PENDING") {
      return res.status(400).json({
        error: "Booking already processed",
      });
    }

    await prisma.serviceBooking.update({
      where: { id: bookingId },
      data: {
        status: "VALIDATED",
        advisorNotes,
        validatedByAdvisorAt: new Date(),
      },
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Advisor validation failed:", error);
    return res.status(500).json({
      error: "Failed to validate booking",
    });
  }
};

/* ================================
   ADVISOR: REJECT BOOKING
================================ */
export const rejectServiceBooking = async (req, res) => {
  try {
    const bookingId = Number(req.params.id);
    const { advisorNotes } = req.body;

    if (!advisorNotes || !advisorNotes.trim()) {
      return res.status(400).json({
        error: "Rejection reason is required",
      });
    }

    const booking = await prisma.serviceBooking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return res.status(404).json({
        error: "Service booking not found",
      });
    }

    // 🔒 Only pending bookings can be rejected
    if (booking.status !== "PENDING") {
      return res.status(400).json({
        error: "Booking already processed",
      });
    }

    await prisma.serviceBooking.update({
      where: { id: bookingId },
      data: {
        status: "REJECTED",
        advisorNotes,                // ✅ CORRECT FIELD
        validatedByAdvisorAt: new Date(),
      },
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Advisor rejection failed:", error);
    return res.status(500).json({
      error: "Failed to reject booking",
    });
  }
};


/* ================================
   ADVISOR: BOOKING HISTORY
================================ */
export const getAdvisorBookingHistory = async (req, res) => {
  try {
    const bookings = await prisma.serviceBooking.findMany({
      where: {
        status: {
          in: ["VALIDATED", "APPROVED", "REJECTED"],
        },
      },
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: "desc", // ✅ FIXED
      },
    });

    return res.json(bookings);
  } catch (error) {
    console.error("Advisor history fetch failed:", error);
    return res.status(500).json({
      error: "Failed to fetch booking history",
    });
  }
};
