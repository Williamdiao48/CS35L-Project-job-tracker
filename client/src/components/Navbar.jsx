import { useState } from "react";

export default function Navbar({ onAddJobClick }) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (tab === "add-job") {
      onAddJobClick?.();
    }
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="topbar-logo">Job Tracker</div>
      </div>
      <div className="topbar-nav">
        <button 
          className={activeTab === "dashboard" ? "active" : ""}
          onClick={() => handleNavClick("dashboard")}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === "settings" ? "active" : ""}
          onClick={() => handleNavClick("settings")}
        >
          Settings
        </button>
        <button 
          className="add-job"
          onClick={() => handleNavClick("add-job")}
        >
          + Add Job
        </button>
      </div>
    </div>
  );
}