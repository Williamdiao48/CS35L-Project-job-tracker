import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ onAddJobClick, onDashboardClick }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  // synchronize active tab with current route
  useEffect(() => {
    if (location.pathname.startsWith("/marketplace")) {
      setActiveTab("marketplace");
    } else if (location.pathname.startsWith("/dashboard")) {
      setActiveTab("dashboard");
    }
  }, [location]);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (tab === "add-job") {
      onAddJobClick?.();
    } else if (tab === "dashboard") {
      onDashboardClick?.();
      navigate("/dashboard");
    } else if (tab === "marketplace") {
      navigate("/marketplace");
    }
  };

  const handleLogout = () =>{
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    navigate('/login');
  }

  return (
    <div className="topbar">
      <div className="topbar-left">
        <span className="nav-label">Job Tracker</span>
      </div>
      <div className="topbar-nav">
        <button
          className={activeTab === "dashboard" ? "active" : ""}
          onClick={() => handleNavClick("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={"marketplace" + (activeTab === "marketplace" ? " active" : "")}
          onClick={() => handleNavClick("marketplace")}
        >
          Marketplace
        </button>
        <button
          className={"add-job" + (activeTab === "add-job" ? " active" : "")}
          onClick={() => handleNavClick("add-job")}
        >
          + Add Job
        </button>
        <button
          onClick={handleLogout}
          style={{ color: "#FF0000" }}>
          Logout
        </button>
      </div>
    </div>
  );
}