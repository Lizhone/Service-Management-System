import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* ================= ROUTES ================= */

// ✅ PUBLIC CHATBOT (NO AUTH)
app.use("/api/chat", chatRoutes);

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});