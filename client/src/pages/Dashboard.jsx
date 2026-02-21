import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Navbar from "../components/Navbar";
import JobForm from "../components/JobForm";
import JobList from "../components/JobList";

export default function Dashboard() {
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [showAddJobForm, setShowAddJobForm] = useState(false);

  const handleAddJobClick = () => {
    setShowAddJobForm(true);
  };

  return (
    <DashboardLayout
      navbar={<Navbar onAddJobClick={handleAddJobClick} />}
    >
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="jobs-container">
        <div>
          <h2>{showAddJobForm ? "Add New Job" : "Quick Add"}</h2>
          <JobForm onCreated={() => {
            setRefreshFlag(f => f + 1);
            setShowAddJobForm(false);
          }} />
          {!showAddJobForm && (
            <p style={{ color: "#666", marginTop: "1rem", fontSize: "0.9em" }}>
              Click "Add Job" in the top bar to add a new application.
            </p>
          )}
        </div>

        <div>
          <h2>Your Job Applications</h2>
          <JobList refresh={refreshFlag} />
        </div>
      </div>
    </DashboardLayout>
  );
}
