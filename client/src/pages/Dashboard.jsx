import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import Navbar from "../components/Navbar";
import JobForm from "../components/JobForm";
import JobList from "../components/JobList";

export default function Dashboard() {
  const navigate = useNavigate();
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

  // clear add-job form when page loads
  useEffect(() => {
    setShowAddJobForm(false);
  }, []);

  const handleAddJobClick = () => {
    setShowAddJobForm(true);
  };

  const handleDashboardClick = () => {
    setShowAddJobForm(false);
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


  return (
    <DashboardLayout
      navbar={<Navbar onAddJobClick={handleAddJobClick} onDashboardClick={handleDashboardClick} />}
    >
      

      <div
        className="jobs-container"
        style={{
          gridTemplateColumns: showAddJobForm ? "1fr 2fr" : "1fr"
        }}
      >
        {showAddJobForm && (
          <div>
            <h2>Adding New Job</h2>
            <JobForm
              onCreated={() => {
                fetchJobs();
                setShowAddJobForm(false);
              }}
            />
          </div>
        )}

        <div>
          <h2>Your Job Applications</h2>
          <div style={{ 
            display: "flex", 
            gap: "1rem", 
            marginBottom: "1.5rem",
            flexWrap: "wrap",
            alignItems: "center"
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

            {/* Search Input moved alongside filters */}
            <input
              type="text"
              placeholder="Search jobs..."
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
              style={{ ...filterSelectStyle, flex: "1 1 250px", minWidth: "200px" }}
            />

          </div>
          {loading ? (
            <div style={{ 
              padding: "2rem",
              textAlign: "center",
              color: "#6b7280"
            }}>
              <p>Loading your job applications...</p>
            </div>
          ) : (
            <>
              <JobList 
                jobs={jobs} 
                search={search}
                statusFilter={statusFilter}
                onJobDeleted={fetchJobs} 
              />
              
            </>
          )}        </div>
      </div>
    </DashboardLayout>
  );
}
