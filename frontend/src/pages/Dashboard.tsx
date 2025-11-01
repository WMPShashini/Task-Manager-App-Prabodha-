import React, { useEffect, useState } from "react";
import Sidebar from "../components/Layout/Sidebar";
import Topbar from "../components/Layout/Topbar";
import TaskCard from "../components/TaskCard";

interface Task {
  _id: string;
  title: string;
  status: "completed" | "Not Started" | "in-progress";
  progress: number;
  assignee?: string;
  dueDate?: string;
  updatedAt?: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    productivity: 0,
  });
  const [filterType, setFilterType] = useState("All");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      // ✅ Fetch both tasks and summary
      const [taskRes, summaryRes] = await Promise.all([
        fetch("http://localhost:5000/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/tasks/summary", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const taskData = await taskRes.json();
      const summaryData = await summaryRes.json();

      // ✅ Convert stage → status for frontend
      const formattedTasks = Array.isArray(taskData)
        ? taskData.map((t) => ({
            ...t,
            status:
              t.stage === "Completed"
                ? "completed"
                : t.stage === "In progress"
                ? "in-progress"
                : "Not Started",
            progress:
              t.stage === "Completed"
                ? 100
                : t.stage === "In progress"
                ? 50
                : 0,
          }))
        : [];

      setTasks(formattedTasks);
      setSummary(summaryData);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please check your connection or login.");
    }
  };

  // ✅ Filter completed tasks by date range
  const filteredCompletedTasks = tasks.filter((t) => {
    if (t.status !== "completed") return false;

    const dateToCompare = t.updatedAt ? new Date(t.updatedAt) : t.dueDate ? new Date(t.dueDate) : null;
    if (!dateToCompare) return false;

    const today = new Date();
    const diffDays = Math.ceil(
      (dateToCompare.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );

    switch (filterType) {
      case "Today":
        return (
          dateToCompare.getDate() === today.getDate() &&
          dateToCompare.getMonth() === today.getMonth() &&
          dateToCompare.getFullYear() === today.getFullYear()
        );
      case "Tomorrow":
        return diffDays === 1;
      case "This Week":
        return diffDays >= 0 && diffDays < 7;
      case "This Month":
        return (
          dateToCompare.getMonth() === today.getMonth() &&
          dateToCompare.getFullYear() === today.getFullYear()
        );
      default:
        return true;
    }
  });

  const getColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#2ecc71";
      case "in-progress":
        return "#f1c40f";
      case "Not Started":
        return "#e74c3c";
      default:
        return "#95a5a6";
    }
  };

  return (
    <div style={{ display: "flex", background: "#f6f8fc", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1 }}>
        <Topbar />

        <div style={{ padding: "30px" }}>
          <p style={{ color: "#666", marginBottom: "25px" }}>
            Task Overview and Productivity Summary 🚀
          </p>

          {error && (
            <div
              style={{
                background: "#ffe0e0",
                padding: "10px",
                borderRadius: "8px",
                color: "#b30000",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          {/* ✅ Summary Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "20px",
              marginBottom: "40px",
            }}
          >
            {[
              { title: "Total Tasks", value: summary.total, color: "#3498db" },
              { title: "Completed", value: summary.completed, color: "#2ecc71" },
              { title: "In Progress", value: summary.inProgress, color: "#f1c40f" },
              { title: "Not Started", value: summary.notStarted, color: "#e74c3c" },
              { title: "Productivity", value: `${summary.productivity}%`, color: "#8e44ad" },
            ].map((c, i) => (
              <div
                key={i}
                style={{
                  background: c.color,
                  color: "#fff",
                  borderRadius: "14px",
                  padding: "25px 20px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  textAlign: "center",
                }}
              >
                <h3 style={{ fontSize: "15px", fontWeight: 500 }}>{c.title}</h3>
                <p style={{ fontSize: "28px", fontWeight: 700 }}>{c.value}</p>
              </div>
            ))}
          </div>

          {/* ✅ Filter Dropdown */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ marginRight: "10px", fontWeight: 500 }}>
              Filter Completed Tasks:
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                background: "#fff",
              }}
            >
              <option>All</option>
              <option>Today</option>
              <option>Tomorrow</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>

          {/* ✅ Completed Task Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {filteredCompletedTasks.length > 0 ? (
              filteredCompletedTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  title={task.title}
                  status={task.status}
                  progress={task.progress}
                  assignee={task.assignee}
                  dueDate={task.dueDate}
                  color={getColor(task.status)}
                />
              ))
            ) : (
              <p style={{ color: "#999", textAlign: "center" }}>
                No completed tasks found for this filter.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
