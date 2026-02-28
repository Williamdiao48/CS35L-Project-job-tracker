import { useState, useCallback, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Navbar from "../components/Navbar";
import JobForm from "../components/JobForm";
import JobList from "../components/JobList";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddJobForm, setShowAddJobForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOption, setSortOption] = useState("newest"); 

  const fetchJobs = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const params = new URLSearchParams();

      if (search) {
        params.append("search", search);
      }

      if (statusFilter) {
        params.append("status", statusFilter);
      }

      if (sortOption) {
        params.append("sort", sortOption);
      }

      const url = `http://localhost:5001/api/jobs?${params.toString()}`;

      const res = await fetch(url, {
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
  }, [search, statusFilter, sortOption]);

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
          <div style={{ 
            display: "flex", 
            gap: "1rem", 
            marginBottom: "1rem",
            flexWrap: "wrap"
          }}>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "0.5rem",
                borderRadius: "6px",
                border: "1px solid #ccc"
              }}
            >
              <option value="">All Statuses</option>
              <option value="Interested">Interested</option>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* Sort Option */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{
                padding: "0.5rem",
                borderRadius: "6px",
                border: "1px solid #ccc"
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="companyAZ">Company A–Z</option>
              <option value="companyZA">Company Z–A</option>
            </select>

          </div>

          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem",
              marginBottom: "1rem",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          />
          {loading ? (
            <p>Loading your jobs...</p>
          ) : (
            <JobList 
            jobs={jobs} 
            search={search}
            statusFilter={statusFilter}
            onJobDeleted={fetchJobs} 
            />
          )}        </div>
      </div>
    </DashboardLayout>
  );
}
