import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

/* ================================
   SERVICE ADVISOR: VIEW BOOKINGS
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
      orderBy: { createdAt: "asc" },
    });

    res.json(bookings);
  } catch (err) {
    console.error("Advisor fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

/* ================================
   SERVICE ADVISOR: VALIDATE BOOKING
================================ */
export const validateBookingByAdvisor = async (req, res) => {
  try {
    const bookingId = Number(req.params.id);
    const { advisorNotes } = req.body;

    const booking = await prisma.serviceBooking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.validatedByAdvisorAt) {
      return res.status(400).json({ error: "Already validated" });
    }

    await prisma.serviceBooking.update({
      where: { id: bookingId },
      data: {
        validatedByAdvisorAt: new Date(),
        advisorNotes,
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Advisor validation failed:", err);
    res.status(500).json({ error: "Validation failed" });
  }
};
