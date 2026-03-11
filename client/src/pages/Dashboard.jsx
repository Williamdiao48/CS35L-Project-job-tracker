import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import Navbar from "../components/Navbar";
import JobForm from "../components/JobForm";
import JobList from "../components/JobList";
import JobMarketplace from "../components/JobMarketplace";

export default function Dashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddJobForm, setShowAddJobForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [editingJob, setEditingJob] = useState(null);
  const formRef = useRef(null);

  const fetchJobs = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);
      if (sortOption) params.append("sort", sortOption);

      const url = `/api/jobs?${params.toString()}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
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
      navbar={
        <Navbar
          onAddJobClick={handleAddJobClick}
          onDashboardClick={handleDashboardClick}
        />
      }
    >
      <div className="jobs-container">

        {/* ADD JOB FORM */}
        {showAddJobForm && (
          <div ref={formRef}>
            <h2>{editingJob ? "Edit Job" : "Quick Add Job"}</h2>
            <JobForm
              editingJob={editingJob}
              onCreated={() => {
                fetchJobs();
                setEditingJob(null);
                setShowAddJobForm(false);
              }}
            />
          </div>
        )}

        {!showAddJobForm && (
          <p
            style={{
              color: "#6b7280",
              marginTop: "1.5rem",
              fontSize: "0.9em",
              fontWeight: "500"
            }}
          >
            Click the "+ Add Job" button in the top bar to add a new application.
          </p>
        )}

        <div>
          <h2>Your Job Applications</h2>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
              alignItems: "center"
            }}
          >

            {/* STATUS FILTER */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={filterSelectStyle}
            >
              <option value="">All Statuses</option>
              <option value="Interested">Interested</option>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* SORT */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={filterSelectStyle}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="companyAZ">Company A–Z</option>
              <option value="companyZA">Company Z–A</option>
            </select>

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ ...filterSelectStyle, flex: "1 1 250px", minWidth: "200px" }}
            />
          </div>

          {loading ? (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "#6b7280"
              }}
            >
              <p>Loading your job applications...</p>
            </div>
          ) : (
            <>
              <JobList
                jobs={jobs}
                search={search}
                statusFilter={statusFilter}
                onJobDeleted={fetchJobs}
                onJobUpdated={fetchJobs}
                onEditJob={(job) => {
                  setEditingJob(job);
                  setShowAddJobForm(true);

                  setTimeout(() => {
                    formRef.current?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}