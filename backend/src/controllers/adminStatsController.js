import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAdminDashboardStats = async (req, res) => {
  try {
    const [
      customers,
      users,
      vehicles,
      jobCards,
      serviceBookings,
      complaints,
      testRides,
      workLogs,
      inspections,
      partsReplaced,
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.user.count(),
      prisma.vehicle.count(),
      prisma.jobCard.count(),
      prisma.serviceBooking.count(),
      prisma.serviceComplaint.count(),
      prisma.testRide.count(),
      prisma.workLog.count(),
      prisma.vehicleInspection.count(),
      prisma.partsReplacement.count(),
    ]);

    const activeJobCards = await prisma.jobCard.count({
      where: {
        status: {
          in: ["OPEN", "IN_PROGRESS"],
        },
      },
    });

    res.json({
      customers,
      users,
      vehicles,
      jobCards,
      activeJobCards,
      serviceBookings,
      complaints,
      testRides,
      workLogs,
      inspections,
      partsReplaced,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ error: "Failed to load dashboard stats" });
  }
};
