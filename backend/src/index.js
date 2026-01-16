import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { config } from "./config/env.js";

// Routes
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
import jobCardMediaRoutes from "./routes/jobCardMediaRoutes.js";

// Middleware
import { prismaMiddleware } from "./middleware/prismaMiddleware.js";
import { authenticate } from "./middleware/authMiddleware.js";

// ES module helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Init app
const app = express();

// =====================================================
// GLOBAL MIDDLEWARE
// =====================================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// PRISMA CONTEXT (MUST COME BEFORE ROUTES)
// =====================================================
app.use(prismaMiddleware);

// =====================================================
// STATIC FILES (MEDIA UPLOADS)
// =====================================================
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../", config.uploadPath))
);

// =====================================================
// PUBLIC ROUTES (NO AUTH REQUIRED)
// =====================================================
app.use("/health", healthRoutes);
app.use("/auth", authRoutes);

// =====================================================
// AUTHENTICATION BOUNDARY
// =====================================================
app.use(authenticate);

// =====================================================
// PROTECTED DOMAIN ROUTES
// =====================================================

// Customers & Vehicles
app.use("/api/customers", customerRoutes);
app.use("/api/vehicles", vehicleRoutes);

// Job Cards & Related Modules
app.use("/job-cards", jobCardRoutes);
app.use("/job-cards", jobCardMediaRoutes);
app.use("/job-cards", inspectionRoutes);
app.use("/job-cards", complaintRoutes);
app.use("/job-cards", partRoutes);

// Work Logs
app.use(workLogRoutes);

// Reports
app.use("/api/reports", reportingRoutes);

// =====================================================
// SERVER STARTUP
// =====================================================
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
