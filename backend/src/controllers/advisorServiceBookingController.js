import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

/* ================================
   ADVISOR: VIEW PENDING BOOKINGS
================================ */
export const getPendingBookingsForAdvisor = async (req, res) => {
  try {
    const bookings = await prisma.serviceBooking.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        customer: true,
      },
      orderBy: { createdAt: "asc" },
    });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load bookings" });
  }
};

/* ================================
   ADVISOR: VALIDATE BOOKING
================================ */
export const validateServiceBooking = async (req, res) => {
  try {
    const bookingId = Number(req.params.id);
    const { advisorNotes } = req.body;

    const booking = await prisma.serviceBooking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.status !== "PENDING") {
      return res.status(400).json({ error: "Invalid booking" });
    }

    await prisma.serviceBooking.update({
      where: { id: bookingId },
      data: {
        status: "VALIDATED",
        advisorNotes: advisorNotes || null,
        validatedAt: new Date(),
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Validation failed" });
  }
};
