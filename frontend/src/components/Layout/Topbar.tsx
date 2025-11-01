import { useAuth } from "../../hooks/useAuth";
import "./Layout.css";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <h2>
        Welcome {user?.username ? user.username : ""} 👋
      </h2>
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </header>
  );
}
