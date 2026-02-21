import { useState, useCallback, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Navbar from "../components/Navbar";
import JobForm from "../components/JobForm";
import JobList from "../components/JobList";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddJobForm, setShowAddJobForm] = useState(false);


  const fetchJobs = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('http://localhost:5001/api/jobs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

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
            fetchJobs();
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
          {loading ? (
            <p>Loading your jobs...</p>
          ) : (
            <JobList jobs={jobs} onJobDeleted={fetchJobs} />
          )}        </div>
      </div>
    </DashboardLayout>
  );
}
