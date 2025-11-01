import { Request, Response } from "express";
import TeamUser from "../models/User";

// ==================== GET ALL USERS ====================
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await TeamUser.find().sort("name");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error while fetching users" });
  }
};

// ==================== ADD NEW USER ====================
export const addUser = async (req: Request, res: Response) => {
  try {
    let { name, userId, email, phone, availableFrom, availableTo } = req.body;

    // Basic validation
    if (!name || !userId || !email || !phone || !availableFrom || !availableTo) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Ensure userId starts with "U"
    if (!userId.toUpperCase().startsWith("U")) {
      userId = `U${userId}`;
    }

    // Check for duplicate userId before saving
    const existing = await TeamUser.findOne({ userId });
    if (existing) {
      return res.status(400).json({ error: "User ID already exists" });
    }

    // Create new user
    const newUser = new TeamUser({
      name,
      userId,
      email,
      phone,
      availableFrom,
      availableTo,
    });

    await newUser.save();
    res.status(201).json(newUser);

  } catch (err: any) {
    console.error("Error adding user:", err);

    // Handle MongoDB unique constraint error
    if (err.code === 11000) {
      return res.status(400).json({ error: "Duplicate User ID detected" });
    }

    res.status(500).json({ error: "Server error while adding user" });
  }
};

// ==================== DELETE USER ====================
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await TeamUser.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Server error while deleting user" });
  }
};
