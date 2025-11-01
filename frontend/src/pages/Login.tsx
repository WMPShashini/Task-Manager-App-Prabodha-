import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF } from "react-icons/fa";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  // ✅ Normal login with backend (JWT)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ✅ Simulated Google / Facebook login
  const loginWithProvider = (provider: string) => {
    const fakeUser = {
      username: provider + "User",
      email: `${provider.toLowerCase()}@example.com`,
    };
    const fakeToken = "FAKE_TOKEN_" + provider.toUpperCase();
    localStorage.setItem("user", JSON.stringify(fakeUser));
    localStorage.setItem("token", fakeToken);
    alert(`Simulated ${provider} login successful`);
    navigate("/dashboard");
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>Welcome to Task Manager</h1>
        <p style={subStyle}>Login to manage your tasks easily</p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="email"
            placeholder="Email or Username"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {error && <p style={{ color: "red", fontSize: 14 }}>{error}</p>}

          {/* Forgot Password */}
          <div style={{ textAlign: "right", marginBottom: "15px" }}>
            <Link
              to="/forgot-password"
              style={{ color: "#4a90e2", fontSize: "14px", textDecoration: "none" }}
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button type="submit" style={loginBtn}>
            Login
          </button>
        </form>

        <div style={divider}>or</div>

        {/* Google and Facebook Login */}
        <div style={socialContainer}>
          <button onClick={() => loginWithProvider("Google")} style={googleBtn}>
            <FaGoogle style={{ marginRight: "8px" }} />
            Continue with Google
          </button>

          <button onClick={() => loginWithProvider("Facebook")} style={facebookBtn}>
            <FaFacebookF style={{ marginRight: "8px" }} />
            Continue with Facebook
          </button>
        </div>

        <p style={signupText}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#4a90e2", fontWeight: "bold" }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

// 🎨 Styles
const containerStyle: React.CSSProperties = {
  display: "flex",
  height: "100vh",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #4a90e2, #7b4397)",
};
const cardStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  padding: "40px",
  width: "400px",
  textAlign: "center",
};
const headingStyle: React.CSSProperties = {
  color: "#4a90e2",
  fontSize: "28px",
  marginBottom: "8px",
};
const subStyle = { color: "#666", marginBottom: "20px" };
const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginBottom: "10px",
  fontSize: "16px",
};
const loginBtn = {
  width: "100%",
  backgroundColor: "#4a90e2",
  color: "#fff",
  padding: "12px",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
  cursor: "pointer",
};
const divider = { margin: "20px 0", color: "#888" };
const socialContainer = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "10px",
};
const googleBtn = {
  backgroundColor: "#db4437",
  color: "#fff",
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "15px",
};
const facebookBtn = {
  backgroundColor: "#4267B2",
  color: "#fff",
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "15px",
};
const signupText = { marginTop: "20px", color: "#555" };
