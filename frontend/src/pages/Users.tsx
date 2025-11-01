import Sidebar from "../components/Layout/Sidebar";
import Topbar from "../components/Layout/Topbar";
import { useEffect, useState } from "react";
import api from "../api/api";

interface User {
  _id: string;
  name: string;
  userId: string;
  email: string;
  phone: string;
  availableFrom: string;
  availableTo: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    userId: "",
    email: "",
    phone: "",
    availableFrom: "",
    availableTo: "",
  });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Failed to load users. Check your backend server.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add new user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, userId, email, phone, availableFrom, availableTo } = newUser;

    if (!name || !userId || !email || !phone || !availableFrom || !availableTo) {
      alert("Please fill in all fields.");
      return;
    }

    // Check if UserID already exists in frontend list
    const formattedId = userId.toUpperCase().startsWith("U")
      ? userId.toUpperCase()
      : `U${userId}`;
    const exists = users.some((u) => u.userId === formattedId);
    if (exists) {
      alert("User ID already exists. Please use a different one.");
      return;
    }

    try {
      await api.post("/users", newUser);
      setShowModal(false);
      setNewUser({
        name: "",
        userId: "",
        email: "",
        phone: "",
        availableFrom: "",
        availableTo: "",
      });
      fetchUsers();
    } catch (err: any) {
      console.error("Error adding user:", err);
      const message =
        err.response?.data?.error || "Failed to add user. Try again.";
      alert(message);
    }
  };

  // Delete user
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch {
      alert("Failed to delete user");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1 }}>
        <Topbar />
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              style={{
                background: "#3498db",
                color: "#fff",
                padding: "10px 15px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => setShowModal(true)}
            >
              + Add User
            </button>
          </div>

          {/* Modal Form */}
          {showModal && (
            <div style={modalOverlay}>
              <div style={modalContent}>
                <h2>Add New User</h2>
                <form
                  onSubmit={handleAddUser}
                  style={{ display: "flex", flexDirection: "column", gap: "10px" }}
                >
                  <input
                    placeholder="Full Name"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    style={inputStyle}
                  />
                  <input
                    placeholder="User ID (numbers only)"
                    value={newUser.userId}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setNewUser({ ...newUser, userId: value });
                    }}
                    style={inputStyle}
                  />
                  <input
                    placeholder="Email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    style={inputStyle}
                  />
                  <input
                    placeholder="Phone Number"
                    value={newUser.phone}
                    onChange={(e) =>
                      setNewUser({ ...newUser, phone: e.target.value })
                    }
                    style={inputStyle}
                  />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <div>
                      <label>Available From:</label>
                      <input
                        type="date"
                        value={newUser.availableFrom}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            availableFrom: e.target.value,
                          })
                        }
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label>Available To:</label>
                      <input
                        type="date"
                        value={newUser.availableTo}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            availableTo: e.target.value,
                          })
                        }
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      style={btnStyle("#e74c3c")}
                    >
                      Cancel
                    </button>
                    <button type="submit" style={btnStyle("#2ecc71")}>
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr style={{ background: "#3498db", color: "#fff" }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>User ID</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Available From</th>
                <th style={thStyle}>Available To</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={tdStyle}>{u.name}</td>
                  <td style={tdStyle}>{u.userId}</td>
                  <td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}>{u.phone}</td>
                  <td style={tdStyle}>{u.availableFrom}</td>
                  <td style={tdStyle}>{u.availableTo}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleDelete(u._id)}
                      style={btnStyle("#e74c3c")}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

// ---------- Styles ----------
const inputStyle: React.CSSProperties = {
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  width: "100%",
};

const modalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalContent: React.CSSProperties = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  width: "400px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
};

const thStyle: React.CSSProperties = { padding: "10px", textAlign: "left" };
const tdStyle: React.CSSProperties = { padding: "10px", textAlign: "left" };
const btnStyle = (bg: string): React.CSSProperties => ({
  background: bg,
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "5px",
  cursor: "pointer",
});
