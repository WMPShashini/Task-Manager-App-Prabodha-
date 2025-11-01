import { Request, Response } from "express";
import TeamUser from "../models/User";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await TeamUser.find().sort("name");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error while fetching users" });
  }
};

export const addUser = async (req: Request, res: Response) => {
  try {
    let { name, userId, email, phone, availableFrom, availableTo } = req.body;

    if (!name || !userId || !email || !phone || !availableFrom || !availableTo) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!userId.toUpperCase().startsWith("U")) {
      userId = `U${userId}`;
    }

    const existing = await TeamUser.findOne({ userId });
    if (existing) {
      return res.status(400).json({ error: "User ID already exists" });
    }

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

    if (err.code === 11000) {
      return res.status(400).json({ error: "Duplicate User ID detected" });
    }

    res.status(500).json({ error: "Server error while adding user" });
  }
};

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
