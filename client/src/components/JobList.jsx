import { useEffect, useState } from 'react';

export default function JobList() {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  if (!jobs.length) return <p>No jobs yet.</p>;

  return (
    <div style={{display:'grid',gap:12}}>
      {jobs.map(job => (
        <div key={job._id} style={{padding:12,border:'1px solid #ddd',borderRadius:6}}>
          <div style={{display:'flex',justifyContent:'space-between'}}>
            <strong>{job.company} — {job.role}</strong>
            <span>{job.status} / {job.outcome}</span>
          </div>
          <div style={{fontSize:12,color:'#555'}}>
            <div>Location: {job.location || '—'}</div>
            <div>Deadline: {job.dueDate ? new Date(job.dueDate).toLocaleDateString() : '—'}</div>
            <div>Tags: {job.tags && job.tags.length ? job.tags.join(', ') : '—'}</div>
            <div style={{marginTop:8}}>{job.notes}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
