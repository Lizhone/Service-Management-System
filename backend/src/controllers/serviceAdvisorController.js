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
