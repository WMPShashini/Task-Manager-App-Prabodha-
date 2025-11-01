import dotenv from "dotenv";
import { connectDB } from "../src/config/db";
import User from "../src/models/Auth";
import Task from "../src/models/Task";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/task_manager_db";

(async () => {
  try {
    await connectDB(MONGO_URI);
    console.log("🌱 Starting database seeding...");

    await User.deleteMany({});
    await Task.deleteMany({});

    const alice = await User.create({ name: "Alice", email: "alice@example.com" });
    const bob = await User.create({ name: "Bob", email: "bob@example.com" });

    await Task.create([
      {
        title: "Set up repository",
        description: "Initialize project and create README",
        assignedTo: alice._id,
        completed: false,
      },
      {
        title: "Design DB schema",
        description: "Define Mongoose models for users and tasks",
        assignedTo: bob._id,
        completed: true,
      },
      {
        title: "Integrate frontend",
        description: "Connect React dashboard with backend",
        assignedTo: alice._id,
        completed: false,
      },
    ]);

    console.log("✅ Database seed complete");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
})();
