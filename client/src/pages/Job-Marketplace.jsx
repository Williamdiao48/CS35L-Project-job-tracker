import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- HELPER FUNCTIONS ---
const formatUrl = (url) => {
  // FIXED: Return null instead of '#' so our conditional rendering works!
  if (!url || typeof url !== 'string') return null;
  
  // If it already has http or https, return it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Otherwise, safely prepend https://
  return `https://${url}`;
};

const JobMarketplace = () => {
  // --- STATE MANAGEMENT ---
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Default search parameters
  const [searchParams, setSearchParams] = useState({
    title: 'Software Engineer',
    location: 'Remote'
  });

  // --- DATA FETCHING ---
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    setJobs([]); // Clear previous results while loading
    
    try {
      // 1. Get the JWT token from local storage
      const token = localStorage.getItem('token');
      
      // 2. Fetch jobs from our backend aggregator
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
    } catch (err) {
      console.error("Error fetching marketplace jobs:", err);
      setError("Failed to load jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Run initial fetch when the component mounts
  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- EVENT HANDLERS ---
  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  // --- RENDER ---
  return (
    <div className="job-marketplace" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Job Marketplace</h2>

      {/* Search Interface */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Job Title (e.g. React Developer)" 
          value={searchParams.title}
          onChange={(e) => setSearchParams({...searchParams, title: e.target.value})}
          required
          style={{ flex: 1, padding: '8px' }}
        />
        <input 
          type="text" 
          placeholder="Location (e.g. New York or Remote)" 
          value={searchParams.location}
          onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'Searching...' : 'Search Jobs'}
        </button>
      </form>

      {/* Status Indicators */}
      {loading && <p>Loading jobs from Adzuna, Reed, and Google...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && jobs.length === 0 && (
        <p>No jobs found for that search. Try tweaking your keywords!</p>
      )}

      {/* Job Results Feed */}
      {!loading && jobs.length > 0 && (
        <div className="job-list">
          {jobs.map((job) => {
            const jobUrl = formatUrl(job.url);
            
            return (
              <div 
                key={job.id} 
                className="job-card" 
                style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', margin: '12px 0', backgroundColor: '#fff' }}
              >
                <h3 style={{ margin: '0 0 8px 0' }}>{job.title}</h3>
                <p style={{ margin: '0 0 8px 0' }}>
                  <strong>{job.company}</strong> • {job.location}
                </p>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#666' }}>
                  Source: {job.source}
                </p>
                
                {/* Safe Link Rendering */}
                {jobUrl ? (
                  <a 
                    href={jobUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ display: 'inline-block', backgroundColor: '#007bff', color: 'white', padding: '6px 12px', textDecoration: 'none', borderRadius: '4px' }}
                  >
                    View Job
                  </a>
                ) : (
                  <span style={{ color: '#888', fontStyle: 'italic', fontSize: '0.9rem' }}>
                    Direct link unavailable (Check {job.source})
                  </span>
                )}
              </div> 
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobMarketplace;