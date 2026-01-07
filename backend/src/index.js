import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { config } from './config/env.js';

// --------------------------------------------------
// Route imports
// --------------------------------------------------
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import jobCardRoutes from './routes/jobCardRoutes.js';
import inspectionRoutes from './routes/inspectionRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import partRoutes from './routes/partRoutes.js';
import reportingRoutes from './routes/reportingRoutes.js';

// --------------------------------------------------
// Path setup (ES Modules)
// --------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------------------------------------
// App init
// --------------------------------------------------
const app = express();

// --------------------------------------------------
// Global middleware
// --------------------------------------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------------------------------------
// Static file serving (uploads)
// --------------------------------------------------
app.use(
  '/uploads',
  express.static(path.join(__dirname, '../', config.uploadPath))
);

// --------------------------------------------------
// Health check
// --------------------------------------------------
app.use('/health', healthRoutes);

// --------------------------------------------------
// Authentication
// --------------------------------------------------
app.use('/auth', authRoutes);

// --------------------------------------------------
// Core APIs
// --------------------------------------------------
app.use('/api/customers', customerRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Job Card is the parent entity
app.use('/job-cards', jobCardRoutes);

// Child entities of Job Card
app.use(inspectionRoutes);  // /job-cards/:id/inspection
app.use(complaintRoutes);   // /job-cards/:id/complaints
app.use(partRoutes);        // /job-cards/:id/parts

// --------------------------------------------------
// Reports
// --------------------------------------------------
app.use('/api/reports', reportingRoutes);

// --------------------------------------------------
// Server start
// --------------------------------------------------
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} already in use.`);
    console.error(`Run: netstat -ano | findstr :${PORT}`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});
