import { useEffect, useState } from 'react';

export default function JobList({ refresh }) {
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

  useEffect(() => {
    fetchJobs();
  }, [refresh]);
  

  if (!jobs.length) {
    return (
      <div style={{
        padding: "20px",
        textAlign: "center",
        color: "#666",
        border: "1px dashed #ccc",
        borderRadius: 8
      }}>
        No jobs yet.
      </div>
    );
  }
  
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {jobs.map(job => (
        <div
          key={job._id}
          style={{
            padding: 16,
            border: "1px solid #e0e0e0",
            borderRadius: 8,
            background: "#fafafa",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
          }}
        >
          {/* Header row */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8
          }}>
            <strong style={{ fontSize: 16 }}>
              {job.company} — {job.role}
            </strong>
  
            <span style={{
              fontSize: 14,
              padding: "2px 8px",
              borderRadius: 4,
              background: "#eee"
            }}>
              {job.status} / {job.outcome}
            </span>
          </div>
  
          {/* Details */}
          <div style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>
            <div><strong>Location:</strong> {job.location || "—"}</div>
            <div>
              <strong>Deadline:</strong>{" "}
              {job.dueDate ? new Date(job.dueDate).toLocaleDateString() : "—"}
            </div>
            <div>
              <strong>Tags:</strong>{" "}
              {Array.isArray(job.tags) && job.tags.length
                ? job.tags.join(", ")
                : "—"}
            </div>
  
            {job.notes && (
              <div style={{ marginTop: 8 }}>
                <strong>Notes:</strong> {job.notes}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  ); 
}
