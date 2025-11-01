import express from "express";
import { getTasks, createTask, updateTask, deleteTask, getTaskSummary } from "../controllers/TaskController";
import { authMiddleware } from "../middleware/Auth";

const router = express.Router();

router.get("/", authMiddleware, getTasks);
router.get("/summary", authMiddleware, getTaskSummary);
router.post("/", authMiddleware, createTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

export default router;
