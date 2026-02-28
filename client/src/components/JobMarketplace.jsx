import { useState, useEffect } from 'react';
import axios from 'axios';

const formatUrl = (url) => {
    if (!url) return '#';
    // If it already has http or https, return it as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Otherwise, add https:// to it
    return `https://${url}`;
  };

const JobMarketplace = () => {
  // State for the jobs and UI feedback
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for the search inputs (defaulting to something reasonable)
  const [searchParams, setSearchParams] = useState({
    title: 'Software Engineer',
    location: 'Remote'
  });

  // The fetch function
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    setJobs([]);
    try {
      // 1. Get the token
      const token = localStorage.getItem('token');
      
      // 2. Add it to the headers
      const response = await axios.get('/api/jobs/discover', {
        params: {
          title: searchParams.title,
          location: searchParams.location
        },
        headers: {
          'Authorization': `Bearer ${token}` // This is the key piece!
        }
      });
      
      setJobs(response.data.jobs);
    } catch (err) {
      console.error("Error fetching marketplace jobs:", err);
      setError("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  // Run once when the component mounts
  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle form submission
  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="job-marketplace">
      <h2>Job Marketplace</h2>

      {/* --- Search Form --- */}
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Job Title (e.g. React Developer)" 
          value={searchParams.title}
          onChange={(e) => setSearchParams({...searchParams, title: e.target.value})}
          required
        />
        <input 
          type="text" 
          placeholder="Location (e.g. New York or Remote)" 
          value={searchParams.location}
          onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search Jobs'}
        </button>
      </form>

      {/* --- UI States --- */}
      {loading && <p>Loading jobs from Adzuna, Reed, and Google...</p>}
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {!loading && !error && jobs.length === 0 && (
        <p>No jobs found for that search. Try tweaking your keywords!</p>
      )}

      {/* --- The Render --- */}
      {!loading && jobs.length > 0 && (
        <div className="job-list">
          {jobs.map((job) => {
            const jobUrl = formatUrl(job.url);
            return(
            <div key={job.id} className="job-card" style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                <h3>{job.title}</h3>
                <p><strong>{job.company}</strong> • {job.location}</p>
                <p><small>Source: {job.source}</small></p>
                {jobUrl ? (
                <a href={jobUrl} target="_blank" rel="noopener noreferrer">
                View Job
                </a>
                ) : (<span style={{ color: '#888', fontStyle: 'italic' }}>Direct link unavailable(Check {job.source})</span>)}
            </div> );
          })}
        </div>
      )}
    </div>
  );
};

export default JobMarketplace;