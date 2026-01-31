import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { config } from "./config/env.js";

// ===============================
// ROUTES
// ===============================
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import jobCardRoutes from "./routes/jobCardRoutes.js";
import inspectionRoutes from "./routes/inspectionRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import partRoutes from "./routes/partRoutes.js";
import reportingRoutes from "./routes/reportingRoutes.js";
import workLogRoutes from "./routes/workLogRoutes.js";

import customerAuthRoutes from "./routes/customerAuthRoutes.js";
import customerMeRoutes from "./routes/customerMeRoutes.js";
import serviceRequestRoutes from "./routes/serviceRequestRoutes.js";
import serviceBookingRoutes from "./routes/serviceBookingRoutes.js";

// ===============================
// MIDDLEWARE
// ===============================
import { prismaMiddleware } from "./middleware/prismaMiddleware.js";
import { authenticate } from "./middleware/authMiddleware.js";

// ===============================
// ES MODULE HELPERS
// ===============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===============================
// APP INIT
// ===============================
const app = express();

// ===============================
// GLOBAL MIDDLEWARE
// ===============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// PRISMA CONTEXT
// ===============================
app.use(prismaMiddleware);

// ===============================
// ✅ STATIC FILES (MEDIA UPLOADS) — PUBLIC
// THIS IS REQUIRED FOR <img src="..."> TO WORK
// ===============================
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../", config.uploadPath))
);

// ===============================
// PUBLIC ROUTES (NO AUTH)
// ===============================
app.use("/health", healthRoutes);
app.use("/auth", authRoutes);

// ===============================
// AUTHENTICATION BOUNDARY
// ===============================
app.use(authenticate);
app.use("/api/auth/customer", customerAuthRoutes);

// ===============================
// PROTECTED DOMAIN ROUTES
// ===============================

// Customers & Vehicles
app.use("/api/customers", customerRoutes);
app.use("/api/vehicles", vehicleRoutes);

// Job Cards (single canonical base)
app.use("/api/job-cards", jobCardRoutes);
app.use("/api/job-cards", inspectionRoutes);
app.use("/api/job-cards", complaintRoutes);
app.use("/api/job-cards", partRoutes);

// Work Logs
app.use("/api", workLogRoutes);

// Reports
app.use("/api/reports", reportingRoutes);

// Customers Me
app.use("/api/customers/me", customerMeRoutes);

// Service Requests
app.use("/api/service-requests", serviceRequestRoutes);

///////////////////////////////////////////////
// Service Bookings
app.use("/api/service-bookings", serviceBookingRoutes);

///////////////////////////////////////////////

// ===============================
// SERVER STARTUP
// ===============================
const PORT = config.port || 4000;

app
  .listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
    console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ Port ${PORT} already in use.`);
      process.exit(1);
    } else {
      console.error("❌ Server error:", err);
      process.exit(1);
    }
  });
