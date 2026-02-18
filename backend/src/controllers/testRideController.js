import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

/* =====================================
   CREATE TEST RIDE (STRICT SLOT CHECK)
===================================== */

export const createTestRide = async (req, res) => {
  try {
    const {
      bikeName,
      location,
      date,
      timeSlot,
      fullName,
      phone,
      email,
    } = req.body;

    const bookingDate = new Date(date);

    // Normalize full day to avoid timezone issues
    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    // 🔥 STRICT CHECK: bike + timeSlot + same day + CONFIRMED
    const existingRide = await prisma.testRide.findFirst({
      where: {
        bikeName,
        timeSlot,
        status: "CONFIRMED",
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (existingRide) {
      return res.status(400).json({
        message:
          "This bike is already booked for the selected date and time. The slot is full. Please try another date or time.",
      });
    }

    const newRide = await prisma.testRide.create({
      data: {
        bikeName,
        location,
        date: bookingDate,
        timeSlot,
        fullName,
        phone,
        email,
        status: "CONFIRMED",
        isViewed: false,
      },
    });

    res.status(201).json(newRide);
  } catch (error) {
    console.error("Create Test Ride Error:", error);
    res.status(500).json({
      message: "Failed to create test ride",
    });
  }
};

/* =====================================
   GET ALL TEST RIDES (ADMIN)
===================================== */

export const getAllTestRides = async (req, res) => {
  try {
    const rides = await prisma.testRide.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(rides);
  } catch (error) {
    console.error("Fetch Test Rides Error:", error);
    res.status(500).json({
      message: "Failed to fetch test rides",
    });
  }
};

/* =====================================
   GET UNVIEWED COUNT (WHITE DOT)
===================================== */

export const getUnviewedTestRideCount = async (req, res) => {
  try {
    const count = await prisma.testRide.count({
      where: {
        isViewed: false,
      },
    });

    res.json({ count });
  } catch (error) {
    console.error("Count Error:", error);
    res.status(500).json({
      message: "Failed to fetch count",
    });
  }
};

/* =====================================
   MARK ALL AS VIEWED
===================================== */

export const markTestRidesAsViewed = async (req, res) => {
  try {
    await prisma.testRide.updateMany({
      where: {
        isViewed: false,
      },
      data: {
        isViewed: true,
      },
    });

    res.json({ message: "Marked as viewed" });
  } catch (error) {
    console.error("Mark Viewed Error:", error);
    res.status(500).json({
      message: "Failed to mark viewed",
    });
  }
};

/* =====================================
   UPDATE STATUS (OPTIONAL)
===================================== */

export const updateTestRideStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedRide = await prisma.testRide.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.json(updatedRide);
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({
      message: "Failed to update status",
    });
  }
};
