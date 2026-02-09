import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

/**
 * GET /api/admin/notifications/status
 * Returns whether unread bookings / complaints exist
 */
export const getAdminNotificationStatus = async (req, res) => {
  try {
    const unreadBookings = await prisma.serviceBooking.count({
      where: { viewedByAdminAt: null }
    });

    const unreadComplaints = await prisma.serviceComplaint.count({
      where: { viewedByAdminAt: null }
    });

    res.json({
      bookings: unreadBookings > 0,
      complaints: unreadComplaints > 0
    });
  } catch (err) {
    console.error("Admin notification status error:", err);
    res.status(500).json({ message: "Failed to fetch notification status" });
  }
};

/**
 * PATCH /api/admin/notifications/bookings/viewed
 */
export const markBookingsAsViewed = async (req, res) => {
  try {
    await prisma.serviceBooking.updateMany({
      where: { viewedByAdminAt: null },
      data: { viewedByAdminAt: new Date() }
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Mark bookings viewed error:", err);
    res.status(500).json({ message: "Failed to mark bookings as viewed" });
  }
};

/**
 * PATCH /api/admin/notifications/complaints/viewed
 */
export const markComplaintsAsViewed = async (req, res) => {
  try {
    await prisma.serviceComplaint.updateMany({
      where: { viewedByAdminAt: null },
      data: { viewedByAdminAt: new Date() }
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Mark complaints viewed error:", err);
    res.status(500).json({ message: "Failed to mark complaints as viewed" });
  }
};
