import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/* ===============================
   CREATE SERVICE BOOKING
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

    if (!vehiclePart || !preferredDate || !timeSlot) {
      return res.status(400).json({ error: "Missing required fields" });
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

    res.status(201).json(booking);
  } catch (error) {
    console.error("SERVICE BOOKING ERROR:", error);
    res.status(500).json({ error: "Failed to create service booking" });
  }
};

/* ===============================
   GET CUSTOMER BOOKINGS
================================ */
export const getMyServiceBookings = async (req, res) => {
  try {
    const customerId = req.user.id;

    const bookings = await prisma.serviceBooking.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
    });

    res.json(bookings);
  } catch (error) {
    console.error("LOAD BOOKINGS ERROR:", error);
    res.status(500).json({ error: "Failed to load service bookings" });
  }
};
