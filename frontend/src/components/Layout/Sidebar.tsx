import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTasks } from "@fortawesome/free-solid-svg-icons";
import "./Layout.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Brand section */}
      <div className="brand-container">
        <FontAwesomeIcon icon={faTasks} className="role-icon" />
        <h2 className="brand">Task Manager</h2>
      </div>

      {/* Navigation */}
      <nav>
        <NavLink to="/dashboard" className="sidebar-link">
          Dashboard
        </NavLink>
        <NavLink to="/tasks" className="sidebar-link">
          Tasks
        </NavLink>
        <NavLink to="/users" className="sidebar-link">
          Users
        </NavLink>
      </nav>
    </aside>
  );
}
