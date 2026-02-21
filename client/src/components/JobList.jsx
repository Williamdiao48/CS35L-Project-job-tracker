import { useEffect, useState } from 'react';

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem"
  },
  emptyState: {
    padding: "3rem 2rem",
    textAlign: "center",
    color: "#666",
    border: "2px dashed #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9"
  },
  emptyText: {
    fontSize: "1.1em",
    margin: "0.5rem 0"
  },
  jobCard: {
    padding: "1.5rem",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    background: "#ffffff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
    transition: "all 0.2s ease",
    cursor: "pointer"
  },
  jobCardHover: {
    boxShadow: "0 4px 8px rgba(26, 110, 214, 0.1)",
    borderColor: "#1a6ed6"
  },
  jobHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    marginBottom: "1rem",
    gap: "1rem"
  },
  jobTitle: {
    fontSize: "1.2em",
    fontWeight: "600",
    color: "#000000",
    margin: "0"
  },
  jobCompany: {
    fontSize: "1em",
    color: "#1a6ed6",
    fontWeight: "500"
  },
  jobRole: {
    fontSize: "1em",
    color: "#555"
  },
  statusBadge: {
    display: "inline-flex",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    fontSize: "0.85em",
    fontWeight: "500",
    whiteSpace: "nowrap",
    flexShrink: 0
  },
  statusApplied: {
    background: "#E3F2FD",
    color: "#1a6ed6"
  },
  statusInterviewing: {
    background: "#FFF3E0",
    color: "#F57C00"
  },
  statusOffer: {
    background: "#E8F5E9",
    color: "#388E3C"
  },
  statusRejected: {
    background: "#FFEBEE",
    color: "#D32F2F"
  },
  jobDetails: {
    fontSize: "0.95em",
    color: "#555",
    lineHeight: "1.7"
  },
  detailRow: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "0.5rem"
  },
  detailLabel: {
    fontWeight: "600",
    color: "#000",
    minWidth: "120px"
  },
  detailValue: {
    color: "#555"
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginTop: "0.75rem"
  },
  tag: {
    display: "inline-block",
    padding: "0.35rem 0.8rem",
    background: "#f0f0f0",
    color: "#333",
    borderRadius: "16px",
    fontSize: "0.85em"
  },
  notes: {
    marginTop: "1rem",
    padding: "1rem",
    background: "#fafafa",
    borderLeft: "3px solid #1a6ed6",
    borderRadius: "4px"
  }
};

export default function JobList({  jobs  }) {
  const [hoveredId, setHoveredId] = useState(null);
  if (jobs.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={{ fontSize: "3em", marginBottom: "1rem" }}>📋</div>
        <div style={styles.emptyText}>No job applications yet</div>
        <div style={{ fontSize: "0.9em", color: "#999", marginTop: "0.5rem" }}>
          Click "Add Job" to get started
        </div>
      </div>
    );
  }  

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Applied':
        return styles.statusApplied;
      case 'Interviewing':
        return styles.statusInterviewing;
      case 'Offer':
        return styles.statusOffer;
      case 'Rejected':
        return styles.statusRejected;
      default:
        return { background: "#F5F5F5", color: "#666" };
    }
  };


  return (
    <div style={styles.container}>
      {jobs.map(job => (
        <div
          key={job._id}
          style={{
            ...styles.jobCard,
            ...(hoveredId === job._id ? styles.jobCardHover : {})
          }}
          onMouseEnter={() => setHoveredId(job._id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div style={styles.jobHeader}>
            <div>
              <h3 style={styles.jobTitle}>
                <span style={styles.jobCompany}>{job.company}</span>
                <span style={{ color: "#999", fontWeight: "400" }}> — </span>
                <span style={styles.jobRole}>{job.role}</span>
              </h3>
            </div>
            <div style={{...styles.statusBadge, ...getStatusStyle(job.status)}}>
              {job.status}
            </div>
          </div>

          <div style={styles.jobDetails}>
            {job.location && (
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>📍 Location:</span>
                <span style={styles.detailValue}>{job.location}</span>
              </div>
            )}

            {job.dueDate && (
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>📅 Deadline:</span>
                <span style={styles.detailValue}>
                  {new Date(job.dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}

            {job.salary && (
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>💰 Salary:</span>
                <span style={styles.detailValue}>{job.salary}</span>
              </div>
            )}

            {job.outcome && job.outcome !== 'Pending' && (
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>📊 Outcome:</span>
                <span style={styles.detailValue}>{job.outcome}</span>
              </div>
            )}

            {job.jobUrl && (
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>🔗 URL:</span>
                <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#1a6ed6" }}>
                  View Job Posting
                </a>
              </div>
            )}

            {Array.isArray(job.tags) && job.tags.length > 0 && (
              <div style={styles.tags}>
                {job.tags.map((tag, idx) => (
                  <span key={idx} style={styles.tag}>{tag}</span>
                ))}
              </div>
            )}

            {job.notes && (
              <div style={styles.notes}>
                <strong>Notes:</strong>
                <div style={{ marginTop: "0.5rem", color: "#666" }}>{job.notes}</div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
