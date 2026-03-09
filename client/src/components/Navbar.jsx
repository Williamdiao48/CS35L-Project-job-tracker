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

  return (
    <div className="topbar">
      {/* left section now empty or could hold logo if desired */}
      <div className="topbar-left" />
      <div className="topbar-nav">
        {/* job tracker label on left */}
        <span className="nav-label" style={{ marginRight: "48.5em" }}>Job Tracker</span>
        <button 
          className={activeTab === "dashboard" ? "active" : ""}
          onClick={() => handleNavClick("dashboard")}
          style={{ marginLeft: "1.5rem" }}
        >
          Dashboard
        </button>
        <button 
          className={"marketplace" + (activeTab === "marketplace" ? " active" : "")}
          onClick={() => handleNavClick("marketplace")}
          style={{ marginLeft: "1rem" }}
        >
          Marketplace
        </button>
        <button 
          className={"add-job" + (activeTab === "add-job" ? " active" : "")}
          onClick={() => handleNavClick("add-job")}
          style={{ marginLeft: "1rem" }}
        >
          + Add Job
        </button>
      </div>
    </div>
  );
}