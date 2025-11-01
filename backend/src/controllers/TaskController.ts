import { Request, Response } from "express";
import Task from "../models/Task";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "userId name")
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch {
    res.status(400).json({ message: "Invalid data" });
  }
};

// Update a task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.stage === "Completed") {
      updateData.completedAt = new Date();
    }

    const updated = await Task.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Task not found" });
    res.json(updated);
  } catch {
    res.status(400).json({ message: "Update failed" });
  }
};

//Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted" });
  } catch {
    res.status(400).json({ message: "Delete failed" });
  }
};

// Dashboard summary stats
export const getTaskSummary = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    const total = tasks.length;
    const completed = tasks.filter(t => t.stage === "Completed").length;
    const inProgress = tasks.filter(t => t.stage === "In progress").length;
    const notStarted = tasks.filter(t => t.stage === "Not Started").length;
    const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({ total, completed, inProgress, notStarted, productivity });
  } catch {
    res.status(500).json({ message: "Failed to load summary" });
  }
};
