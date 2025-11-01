import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User", // ✅ must match the name in mongoose.model("User", UserSchema)
},

    // ✅ Add these fields
    team: { type: String, default: "" },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    stage: { type: String, enum: ["Not Started", "In progress", "Completed"], default: "Not Started" },
    dueDate: { type: Date },

    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
