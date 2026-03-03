import { useState, useCallback, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Navbar from "../components/Navbar";
import JobForm from "../components/JobForm";
import JobList from "../components/JobList";
import JobMarketplace from '../components/JobMarketplace';

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

  const filterSelectStyle = {
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "1.5px solid #e5e7eb",
    fontSize: "0.95em",
    fontFamily: "inherit",
    backgroundColor: "#ffffff",
    color: "#000000",
    cursor: "pointer",
    transition: "all 0.25s ease",
    minWidth: "150px"
  };

  const searchInputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    marginBottom: "1.5rem",
    borderRadius: "8px",
    border: "1.5px solid #e5e7eb",
    fontSize: "0.95em",
    fontFamily: "inherit",
    backgroundColor: "#ffffff",
    color: "#000000",
    transition: "all 0.25s ease"
  };

  return (
    <DashboardLayout
      navbar={<Navbar onAddJobClick={handleAddJobClick} />}
    >
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="jobs-container">
        <div>
          <h2>{showAddJobForm ? "Adding New Job" : "Quick Add Job"}</h2>
          <JobForm onCreated={() => {
            fetchJobs();
            setShowAddJobForm(false);
          }} />
          {!showAddJobForm && (
            <p style={{ color: "#6b7280", marginTop: "1.5rem", fontSize: "0.9em", fontWeight: "500" }}>
              Click the "+ Add Job" button in the top bar to add a new application.
            </p>
          )}
        </div>

        <div>
          <h2>Your Job Applications</h2>
          <div style={{ 
            display: "flex", 
            gap: "1rem", 
            marginBottom: "1.5rem",
            flexWrap: "wrap"
          }}>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "#1a6ed6";
                e.target.style.boxShadow = "0 0 0 4px rgba(26, 110, 214, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
              style={filterSelectStyle}
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
              onFocus={(e) => {
                e.target.style.borderColor = "#1a6ed6";
                e.target.style.boxShadow = "0 0 0 4px rgba(26, 110, 214, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
              style={filterSelectStyle}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="companyAZ">Company A–Z</option>
              <option value="companyZA">Company Z–A</option>
            </select>

          </div>

          <input
            type="text"
            placeholder="Search jobs by company, role, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = "#1a6ed6";
              e.target.style.boxShadow = "0 0 0 4px rgba(26, 110, 214, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e5e7eb";
              e.target.style.boxShadow = "none";
            }}
            style={searchInputStyle}
          />
          {loading ? (
            <div style={{ 
              padding: "2rem",
              textAlign: "center",
              color: "#6b7280"
            }}>
              <p>Loading your job applications...</p>
            </div>
          ) : (
            <JobList 
              jobs={jobs} 
              search={search}
              statusFilter={statusFilter}
              onJobDeleted={fetchJobs} 
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
