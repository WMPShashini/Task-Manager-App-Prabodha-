import { useState, useEffect } from "react";
import api from "../api/api";

interface TaskFormProps {
  initialData: {
    _id?: string;
    title?: string;
    description?: string;
    assignedTo?: string;
    team?: string;
    priority?: "Low" | "Medium" | "High";
    stage?: "Not Started" | "In progress" | "Completed";
    dueDate?: string;
  };
  onSave: (data: any) => void;
  onCancel: () => void;
}

interface User {
  _id: string;
  userId: string;
  name?: string;
}

export default function TaskForm({ initialData, onSave, onCancel }: TaskFormProps) {
  const isEditMode = Boolean(initialData._id);
  const [users, setUsers] = useState<User[]>([]);

  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    assignedTo: initialData.assignedTo || "",
    team: initialData.team || "",
    priority: initialData.priority || "",
    stage: initialData.stage || "",
    dueDate: initialData.dueDate
      ? new Date(initialData.dueDate).toISOString().substring(0, 10)
      : "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error loading users:", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    setFormData({
      title: initialData.title || "",
      description: initialData.description || "",
      assignedTo: initialData.assignedTo || "",
      team: initialData.team || "",
      priority: initialData.priority || "",
      stage: initialData.stage || "",
      dueDate: initialData.dueDate
        ? new Date(initialData.dueDate).toISOString().substring(0, 10)
        : "",
    });
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  onSave({
    ...formData,
    assignedTo: formData.assignedTo || null,
  });
};


  const isCompleted = formData.stage === "Completed";

  return (
    <div>
      <h2 style={{ marginBottom: "15px" }}>
        {isEditMode ? "Edit Task" : "Add New Task"}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <label>
          Title:
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            style={input}
            disabled={isCompleted}
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            style={textarea}
            disabled={isCompleted}
          />
        </label>

        <label>
          Assigned To:
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            style={input}
            disabled={isCompleted}
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.userId}
              </option>
            ))}
          </select>
        </label>

        <label>
          Team:
          <input
            name="team"
            value={formData.team}
            onChange={handleChange}
            placeholder="Enter team name"
            style={input}
            disabled={isCompleted}
          />
        </label>

        <label>
          Priority:
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            style={input}
            disabled={isCompleted}
          >
            <option value="">Select priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <label>
          Stage:
          <select
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            style={input}
            disabled={isCompleted}
          >
            <option value="">Select stage</option>
            <option value="Not Started">Not Started</option>
            <option value="In progress">In progress</option>
            {isEditMode && <option value="Completed">Completed</option>}
          </select>
        </label>

        <label>
          Due Date:
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            style={input}
            disabled={isCompleted}
          />
        </label>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={onCancel} style={cancelBtn}>
            Cancel
          </button>
          <button onClick={handleSubmit} style={saveBtn}>
            {isEditMode ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

const input = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  width: "100%",
};

const textarea = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  minHeight: "60px",
  width: "100%",
};

const saveBtn = {
  background: "#4a90e2",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: "6px",
  cursor: "pointer",
};

const cancelBtn = {
  background: "#ccc",
  border: "none",
  padding: "10px 16px",
  borderRadius: "6px",
  cursor: "pointer",
};
