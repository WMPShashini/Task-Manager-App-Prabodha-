import React from "react";

interface TaskCardProps {
  title: string;
  status: "completed" | "Not Started" | "in-progress";
  progress: number;            // ✅ Add this line
  assignee?: string;
  dueDate?: string;
  color?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  status,
  progress,
  assignee,
  dueDate,
  color = "#ccc",
}) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        borderTop: `5px solid ${color}`,
      }}
    >
      <h3 style={{ marginBottom: "8px" }}>{title}</h3>
      <p style={{ color: "#555", marginBottom: "5px" }}>Status: {status}</p>
      <p style={{ color: "#555", marginBottom: "5px" }}>
        Progress: {progress}%
      </p>
      {assignee && <p style={{ color: "#777" }}>Assignee: {assignee}</p>}
      {dueDate && <p style={{ color: "#777" }}>Due: {new Date(dueDate).toLocaleDateString()}</p>}
    </div>
  );
};

export default TaskCard;
