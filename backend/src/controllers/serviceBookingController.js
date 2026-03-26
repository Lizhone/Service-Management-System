import { PrismaClient } from "@prisma/client";
import { sendWhatsAppMessage } from "../utils/sendWhatsApp.js";

const prisma = new PrismaClient();

/* =====================================================
   CREATE SERVICE BOOKING
===================================================== */
export const createServiceBooking = async (req, res) => {
  try {
    let customerId;

    // ✅ AUTH USER (Dashboard)
    if (req.user && req.user.id) {
      customerId = req.user.id;
      console.log("🔐 AUTH USER:", customerId);
    } 
    
    // ✅ WHATSAPP USER
    else {
      console.log("📱 WHATSAPP BOOKING FLOW");

      const phone = req.body.mobileNumber;

      if (!phone) {
        return res.status(400).json({
          error: "Mobile number is required",
        });
      }

      // 🔍 FIND EXISTING CUSTOMER ONLY
      let customer = await prisma.customer.findFirst({
        where: {
          mobileNumber: {
            contains: phone.slice(-10),
          },
        },
      });

      // ❌ BLOCK NEW USERS
      if (!customer) {
        return res.status(403).json({
          error: "You are not registered. Please visit showroom for first booking.",
        });
      }

      console.log("👤 Existing customer:", customer.id);

      customerId = customer.id;

      // 🚗 VEHICLE VALIDATION
      const vehicle = await prisma.vehicle.findFirst({
        where: {
          customerId: customerId,
          vin: req.body.vehicleNumber,
        },
      });

      if (!vehicle) {
        return res.status(400).json({
          error: "Vehicle not found. Please use registered vehicle.",
        });
      }
    }

    const { vehiclePart, serviceType, preferredDate, timeSlot, notes } = req.body;

    if (!vehiclePart || !serviceType || !preferredDate || !timeSlot) {
      return res.status(400).json({
        error: "All required fields must be provided",
      });
    }

    // ⏰ SLOT CHECK
    const count = await prisma.serviceBooking.count({
      where: {
        preferredDate: new Date(preferredDate),
        timeSlot: timeSlot,
      },
    });

    if (count >= 5) {
      return res.status(400).json({
        error: "Selected time slot is full. Please choose another time or date.",
      });
    }

    // ✅ Create Booking
    const booking = await prisma.serviceBooking.create({
      data: {
        customerId,
        vehiclePart,
        serviceType,
        preferredDate: new Date(preferredDate),
        timeSlot,
        notes: notes || "WhatsApp Booking",
      },
    });

    // ✅ Create Job Card (UNCHANGED — correct logic)
    const jobCard = await prisma.jobCard.create({
      data: {
        jobCardNumber: `JC-${Date.now()}`,
        customerId: booking.customerId,
        vehicleId: 1,
        serviceType: booking.serviceType,
        serviceInDatetime: booking.preferredDate,
        status: "OPEN",
        remarks: booking.notes || "",
      },
    });

    // 📩 SEND WHATSAPP CONFIRMATION
const customerDetails = await prisma.customer.findUnique({
  where: { id: booking.customerId },
});

if (customerDetails?.mobileNumber) {
  await sendWhatsAppMessage(
    `+91${customerDetails.mobileNumber}`, // ✅ important
    `✅ Booking Confirmed!

🧾 Job Card: ${jobCard.jobCardNumber}
🔧 Service: ${booking.serviceType}
📅 Date: ${booking.preferredDate.toDateString()}
⏰ Time: ${booking.timeSlot}

👉 Reply "hi" to manage your booking`
  );
}

    // ✅ Link Job Card
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
   CUSTOMER BOOKINGS
===================================================== */
export const getMyServiceBookings = async (req, res) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

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
   ADMIN: ALL BOOKINGS
===================================================== */
export const getAllServiceBookings = async (req, res) => {
  try {
    const bookings = await prisma.serviceBooking.findMany({
      include: {
        customer: true,
        claimedByProfile: true,
        jobCard: {
          include: {
            workLogs: {
              orderBy: { createdAt: "asc" }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return res.json(bookings);

  } catch (error) {
    console.error("Fetch all bookings error:", error);
    return res.status(500).json({
      error: "Failed to fetch service bookings",
    });
  }
};


/* =====================================================
   BOOKING DETAIL
===================================================== */
export const getCustomerBookingDetail = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await prisma.serviceBooking.findUnique({
      where: { id: Number(bookingId) },
      include: {
        media: true,
        jobCard: {
          include: {
            complaints: true,
            workLogs: {
              orderBy: { createdAt: "asc" }
            }
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    res.json(booking);

  } catch (error) {
    console.error("Booking detail error:", error);
    res.status(500).json({
      message: "Failed to fetch booking detail"
    });
  }
};