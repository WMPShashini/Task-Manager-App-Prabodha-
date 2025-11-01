import { useEffect, useState } from "react";
import Sidebar from "../components/Layout/Sidebar";
import Topbar from "../components/Layout/Topbar";
import api from "../api/api";
import TaskForm from "../components/TaskForm";

interface AssignedUser {
  _id: string;
  userId: string;
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  assignedTo?: AssignedUser | null; // ✅ updated type
  team?: string;
  priority?: "Low" | "Medium" | "High";
  stage?: "Not Started" | "In progress" | "Completed";
  dueDate?: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStage, setFilterStage] = useState("All");

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSave = async (task: Partial<Task>) => {
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, task);
        setEditingTask(null);
      } else {
        await api.post("/tasks", task);
      }
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      console.error("Error saving task:", err);
      alert("Failed to save task");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this task?")) return;
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const filteredTasks =
    filterStage === "All"
      ? tasks
      : tasks.filter(
          (t) => t.stage?.toLowerCase() === filterStage.toLowerCase()
        );

  return (
    <div style={{ display: "flex", background: "#f8f9fb", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1 }}>
        <Topbar />

        <div style={{ padding: "30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1 style={{ fontSize: 26 }}>Task Management</h1>
            <button
              onClick={() => {
                setEditingTask(null);
                setShowModal(true);
              }}
              style={addBtn}
            >
              + Add Task
            </button>
          </div>

          {/* ✅ Filter dropdown */}
          <div style={{ marginTop: 20, textAlign: "right" }}>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              style={filterSelect}
            >
              <option>All</option>
              <option>Not Started</option>
              <option>In progress</option>
              <option>Completed</option>
            </select>
          </div>

          {/* ✅ Task Table */}
          <table style={tableStyle}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th style={th}>Task</th>
                <th style={th}>Stage</th>
                <th style={th}>Priority</th>
                <th style={th}>Team</th>
                <th style={th}>Assignee</th>
                <th style={th}>Due Date</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((t) => {
                  const isCompleted = t.stage === "Completed";
                  return (
                    <tr
                      key={t._id}
                      style={{
                        ...trStyle,
                        color: isCompleted ? "#888" : "inherit",
                        background: isCompleted ? "#f0f0f0" : "#fff",
                      }}
                    >
                      <td style={td}>{t.title}</td>
                      <td style={td}>{t.stage}</td>
                      <td style={td}>{t.priority || "-"}</td>
                      <td style={td}>{t.team || "-"}</td>

                      <td style={td}>
                          {t.assignedTo ? typeof t.assignedTo === "object"
                                        ? `${t.assignedTo.userId}`
                                            : t.assignedTo: "-"}
                    </td>

                      <td style={td}>
                        {t.dueDate
                          ? new Date(t.dueDate).toLocaleDateString()
                          : "-"}
                      </td>

                      <td style={td}>
                        <button
                          onClick={() => {
                            if (!isCompleted) {
                              setEditingTask(t);
                              setShowModal(true);
                            }
                          }}
                          style={{
                            ...btn("#3498db"),
                            opacity: isCompleted ? 0.5 : 1,
                            cursor: isCompleted ? "not-allowed" : "pointer",
                          }}
                          disabled={isCompleted}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => !isCompleted && handleDelete(t._id)}
                          style={{
                            ...btn("#e74c3c"),
                            opacity: isCompleted ? 0.5 : 1,
                            cursor: isCompleted ? "not-allowed" : "pointer",
                          }}
                          disabled={isCompleted}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#999",
                    }}
                  >
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showModal && (
        <div style={overlay}>
          <div style={modalBox}>
            <TaskForm
              initialData={editingTask || {}}
              onSave={handleSave}
              onCancel={() => {
                setShowModal(false);
                setEditingTask(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const addBtn: React.CSSProperties = {
  background: "#4a90e2",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  background: "#fff",
  borderCollapse: "collapse",
  marginTop: "20px",
};

const th: React.CSSProperties = {
  padding: "12px",
  borderBottom: "2px solid #eee",
  fontWeight: 600,
  color: "#555",
};

const td: React.CSSProperties = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};

const trStyle: React.CSSProperties = {
  background: "#fff",
};

const btn = (bg: string): React.CSSProperties => ({
  background: bg,
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  marginRight: "6px",
  cursor: "pointer",
});

const filterSelect: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const overlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalBox: React.CSSProperties = {
  background: "#fff",
  padding: "25px",
  borderRadius: "10px",
  width: "400px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};
