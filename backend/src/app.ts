import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/AuthRoute";
import taskRoutes from "./routes/TaskRoute";
import userRoutes from "./routes/UserRoute";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Main routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

export default app;
