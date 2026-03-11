import { useState, useEffect } from 'react';
import axios from 'axios';

const formatUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
};

const jobMarketplaceStyles = {
  container: {
    marginTop: "2rem"
  },
  searchForm: {
    display: "grid",
    gap: "1rem",
    marginBottom: "2rem",
    padding: "2rem",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)"
  },
  inputsContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem"
  },
  input: {
    padding: "0.75rem 1rem",
    border: "1.5px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "0.95em",
    fontFamily: "inherit",
    backgroundColor: "#ffffff",
    color: "#000000",
    transition: "all 0.25s ease"
  },
  submitBtn: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#1a6ed6",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1em",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    width: "100%"
  },
  loadingText: {
    padding: "2rem",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "1em"
  },
  errorText: {
    padding: "1rem",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    borderRadius: "8px",
    border: "1px solid #fecaca"
  },
  jobList: {
    display: "grid",
    gap: "1.5rem"
  },
  jobCard: {
    padding: "2rem",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
    transition: "all 0.3s ease"
  },
  jobTitle: {
    fontSize: "1.2em",
    fontWeight: "700",
    color: "#000000",
    margin: "0 0 0.75rem 0"
  },
  jobMeta: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1rem",
    fontSize: "0.95em",
    color: "#6b7280"
  },
  jobCompany: {
    fontWeight: "700",
    color: "#1a6ed6"
  },
  jobLink: {
    display: "inline-block",
    marginTop: "1rem",
    padding: "0.6rem 1.2rem",
    backgroundColor: "#1a6ed6",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.95em",
    transition: "all 0.3s ease"
  },
  noJobs: {
    padding: "2rem",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "0.95em"
  },
  saveBtn: {
    display: "inline-block",
    marginTop: "1rem",
    marginLeft: "0.75rem",
    padding: "0.6rem 1.2rem",
    backgroundColor: "#ffffff",
    color: "#1a6ed6",
    border: "1.5px solid #1a6ed6",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.95em",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  saveBtnSaved: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
    border: "1.5px solid #15803d",
    cursor: "default"
  },
  saveBtnError: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "1.5px solid #dc2626",
    cursor: "pointer"
  }  
};

const JobMarketplace = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(null);
  const [saveStatuses, setSaveStatuses] = useState({});

  const [searchParams, setSearchParams] = useState({
    title: '',
    location: ''
  });

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    setJobs([]);
    setTotal(null);
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get('/api/jobs/discover', {
        params: {
          title: searchParams.title,
          location: searchParams.location
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setJobs(response.data.jobs);
      setTotal(response.data.total);
    } catch (err) {
      console.error("Error fetching marketplace jobs:", err);
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const saveJob = async(job) =>{
    setSaveStatuses(prev =>({ ...prev, [job.id]: 'saving'}));
    try{
      const token = localStorage.getItem('token');
      const res = await fetch('/api/jobs',{
        method: 'POST', headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          company: job.company,
          role:job.title,
          location: job.location || '',
          jobUrl: job.url || '',
          status: 'Interested'
        })
      });
      if(!res.ok) throw new Error('Failed to save');
      setSaveStatuses(prev => ({ ...prev, [job.id]: 'saved'}));
    } catch(err){
      console.error('Save job error:', err);
      setSaveStatuses(prev=>({ ...prev, [job.id]: 'error'}));
    }
    }
  

  return (
    <div style={jobMarketplaceStyles.container}>
      <h2 style={{ marginBottom: "1.5rem" }}>Job Marketplace</h2>

      {/* Search Form */}
      <form onSubmit={handleSearch} style={jobMarketplaceStyles.searchForm}>
        <div style={jobMarketplaceStyles.inputsContainer}>
          <input 
            type="text" 
            placeholder="Job Title (e.g., Software Developer)" 
            value={searchParams.title}
            onChange={(e) => setSearchParams({...searchParams, title: e.target.value})}
            style={jobMarketplaceStyles.input}
            onFocus={(e) => {
              e.target.style.borderColor = "#1a6ed6";
              e.target.style.boxShadow = "0 0 0 4px rgba(26, 110, 214, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e5e7eb";
              e.target.style.boxShadow = "none";
            }}
            required
          />
          <input 
            type="text" 
            placeholder="Location (e.g., New York or Remote)" 
            value={searchParams.location}
            onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
            style={jobMarketplaceStyles.input}
            onFocus={(e) => {
              e.target.style.borderColor = "#1a6ed6";
              e.target.style.boxShadow = "0 0 0 4px rgba(26, 110, 214, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e5e7eb";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
        <button 
          type="submit" 
          style={{
            ...jobMarketplaceStyles.submitBtn,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer"
          }}
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search Jobs'}
        </button>
      </form>

      {/* Loading State */}
      {loading && (
        <div style={jobMarketplaceStyles.loadingText}>
          ⏳ Searching jobs from multiple sources...
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div style={jobMarketplaceStyles.errorText}>
          {error}
        </div>
      )}
      
      {/* Empty State */}
      {!loading && !error && jobs.length === 0 && (
        <div style={jobMarketplaceStyles.noJobs}>
          <div style={{ fontSize: "2.5em", marginBottom: "0.5rem" }}>🔍</div>
          No jobs found for that search. Try tweaking your keywords!
        </div>
      )}

      {/* Job Results */}
      {!loading && jobs.length > 0 && (
        <>
        <div style={{ marginBottom: "1rem", color: "#6b7280", fontSize: "0.95em" }}>
        Showing {total} result{total !== 1 ? 's' : ''}
        </div>
        <div style={jobMarketplaceStyles.jobList}>
          {jobs.map((job) => {
            const jobUrl = formatUrl(job.url);
            return (
              <div key={job.id} style={jobMarketplaceStyles.jobCard}>
                <h3 style={jobMarketplaceStyles.jobTitle}>{job.title}</h3>
                <div style={jobMarketplaceStyles.jobMeta}>
                  <span style={jobMarketplaceStyles.jobCompany}>{job.company}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                  <span>•</span>
                  <span style={{ fontSize: "0.85em" }}>via {job.source}</span>
                </div>
                {jobUrl && jobUrl !== '#' ? (
                  <a 
                    href={jobUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={jobMarketplaceStyles.jobLink}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#0d5099"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#1a6ed6"}
                  >
                    View Job
                  </a>
                ) : (
                  <div style={{ color: "#9ca3af", fontSize: "0.9em", marginTop: "1rem" }}>
                    📌 Link unavailable — check {job.source} directly
                  </div>
                )}
                <button
                  onClick={() => saveJob(job)}
                  disabled={saveStatuses[job.id] === 'saving'||saveStatuses[job.id] === 'saved'}
                  style ={{
                    ...jobMarketplaceStyles.saveBtn,
                    ...(saveStatuses[job.id] === 'saved' ? jobMarketplaceStyles.saveBtnSaved : {}),
                    ...(saveStatuses[job.id] === 'error' ? jobMarketplaceStyles.saveBtnError : {})
                  }}>
                  {saveStatuses[job.id] === 'saving' && 'Saving...'}
                  {saveStatuses[job.id] === 'saved' && 'Saved'}
                  {saveStatuses[job.id] === 'error' && 'Failed — Retry?'}
                  {(!saveStatuses[job.id] || saveStatuses[job.id] === 'idle') && '+ Save to Your Jobs'}
                </button>
              </div>
            );
          })}
        </div>
        </>
      )}
    </div>
  );
};

export default JobMarketplace;