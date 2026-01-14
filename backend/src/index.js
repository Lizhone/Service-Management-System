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

// Path setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Init app
const app = express();

// Global middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../", config.uploadPath))
);

// Health & Auth (public)
app.use("/health", healthRoutes);
app.use("/auth", authRoutes);

// Public job card search
app.use("/job-cards/search", jobCardRoutes);

// Prisma connection
app.use(prismaMiddleware);

// Everything below this requires authentication
app.use(authenticate);

// Core APIs
app.use("/api/customers", customerRoutes);
app.use("/api/vehicles", vehicleRoutes);

// Job cards
app.use("/job-cards", jobCardRoutes);
app.use(jobCardMediaRoutes);
app.use(inspectionRoutes);
app.use(complaintRoutes);
app.use(partRoutes);

// Reports & logs
app.use("/api/reports", reportingRoutes);
app.use(workLogRoutes);

// Start server
const PORT = config.port || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
}).on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} already in use.`);
    process.exit(1);
  } else {
    console.error("Server error:", err);
    process.exit(1);
  }
});
