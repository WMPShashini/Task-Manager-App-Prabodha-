import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  username: string;
  email: string;
  password: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<User & { confirmPassword: string }>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
    };

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.message || "Registration failed" });
        return;
      }

      alert("Registration successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setErrors({ general: "Server error, please try again later" });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #56ab2f, #a8e063)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          padding: "40px",
          width: "450px",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#2e7d32", fontSize: "28px", marginBottom: "8px" }}>
          Create an Account
        </h1>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "20px" }}>
          Register to start managing your tasks
        </p>

        {errors.general && (
          <p style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>
            {errors.general}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "16px" }}
            />
            {errors.username && <p style={{ color: "red", fontSize: "14px" }}>{errors.username}</p>}
          </div>

          {/* Email */}
          <div style={{ marginBottom: "15px" }}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "16px" }}
            />
            {errors.email && <p style={{ color: "red", fontSize: "14px" }}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: "15px" }}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "16px" }}
            />
            {errors.password && <p style={{ color: "red", fontSize: "14px" }}>{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: "15px" }}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "16px" }}
            />
            {errors.confirmPassword && <p style={{ color: "red", fontSize: "14px" }}>{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              backgroundColor: "#2e7d32",
              color: "#fff",
              padding: "12px",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#555" }}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} style={{ color: "#2e7d32", fontWeight: "bold", cursor: "pointer" }}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
