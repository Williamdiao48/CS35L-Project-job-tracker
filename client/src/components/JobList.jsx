import { useState } from 'react';

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  emptyState: {
    padding: "3rem 1.5rem",
    textAlign: "center",
    color: "#6b7280",
    border: "2px dashed #e5e7eb",
    borderRadius: "12px",
    backgroundColor: "#f9fafb"
  },
  emptyText: {
    fontSize: "1.2em",
    fontWeight: "600",
    margin: "0.5rem 0",
    color: "#374151"
  },
  jobCard: {
    padding: "1.5rem",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    background: "#ffffff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  jobHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    marginBottom: "1rem",
    gap: "0.75rem"
  },
  jobTitle: {
    fontSize: "1.1em",
    fontWeight: "600",
    color: "#000000",
    margin: "0",
    lineHeight: "1.3"
  },
  jobCompany: {
    fontSize: "1em",
    color: "#1a6ed6",
    fontWeight: "700"
  },
  jobRole: {
    fontSize: "0.9em",
    color: "#6b7280"
  },
  statusBadge: {
    display: "inline-flex",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    fontSize: "0.85em",
    fontWeight: "600",
    whiteSpace: "nowrap",
    flexShrink: 0
  },
  statusApplied: {
    background: "#dbeafe",
    color: "#1a6ed6"
  },
  statusInterviewing: {
    background: "#fef3c7",
    color: "#b45309"
  },
  statusOffer: {
    background: "#dcfce7",
    color: "#15803d"
  },
  statusRejected: {
    background: "#fee2e2",
    color: "#dc2626"
  },
  jobDetails: {
    fontSize: "0.9em",
    color: "#6b7280",
    lineHeight: "1.6"
  },
  detailRow: {
    display: "flex",
    gap: "0.65rem",
    marginBottom: "0.75rem",
    alignItems: "flex-start"
  },
  detailLabel: {
    fontWeight: "700",
    color: "#374151",
    minWidth: "110px",
    flex: "0 0 auto"
  },
  detailValue: {
    color: "#6b7280"
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.65rem",
    marginTop: "1rem"
  },
  tag: {
    display: "inline-block",
    padding: "0.5rem 1rem",
    background: "#f3f4f6",
    color: "#374151",
    borderRadius: "20px",
    fontSize: "0.85em",
    fontWeight: "500",
    border: "1px solid #e5e7eb"
  },
  notes: {
    marginTop: "1.5rem",
    padding: "1.25rem",
    background: "#eff6ff",
    borderLeft: "4px solid #1a6ed6",
    borderRadius: "8px"
  },
  notesText: {
    color: "#1e40af",
    marginTop: "0.5rem",
    lineHeight: "1.6"
  }
};

export default function JobList({ jobs, search, statusFilter, onJobDeleted, onJobUpdated, onEditJob }) {
  
  const updateStatus = async (jobId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
  
      if (res.ok) {
        if (onJobUpdated) onJobUpdated();
      } else {
        console.error("Failed to update status");
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  if (jobs.length === 0) {
    if (
      (search && search.trim() !== "") ||
      (statusFilter && statusFilter !== "")
    ) {
      return (
        <div style={styles.emptyState}>
          <div style={{ fontSize: "3em", marginBottom: "1rem" }}>🔎</div>
          <div style={styles.emptyText}>
            No jobs match your filters
          </div>
          <div style={{ fontSize: "0.9em", color: "#9ca3af", marginTop: "0.75rem" }}>
            Try adjusting your search or filter criteria
          </div>
        </div>
      );
    }
    return (
      <div style={styles.emptyState}>
        <div style={{ fontSize: "3em", marginBottom: "1rem" }}>📋</div>
        <div style={styles.emptyText}>No job applications yet</div>
        <div style={{ fontSize: "0.9em", color: "#9ca3af", marginTop: "0.75rem" }}>
          Click the "+ Add Job" button to get started
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
        return { background: "#f3f4f6", color: "#6b7280" };
    }
  };

  const getDeadlineBadge = (dueDate, status) => {
    if (!dueDate) return null;
    if (status !== 'Interested') return null;  
    const now = new Date();
    const due = new Date(dueDate);
    const daysLeft = Math.ceil((due-now) / (1000*60*60*24));
    if (daysLeft < 0) return { label: 'Overdue', color: '#dc2626', bg: '#fee2e2' };
    if (daysLeft === 0) return { label: 'Due today', color: '#dc2626', bg: '#fee2e2' };
    if (daysLeft <= 3) return { label: `Due in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`, color: '#b45309', bg: '#fef3c7' };
    if (daysLeft <= 7) return { label: `Due in ${daysLeft} days`, color: '#1d4ed8', bg: '#dbeafe' };
    return null;
  };

  return (
    <div style={styles.container}>
      {jobs.map(job => (
        <div
          key={job._id}
          style={styles.jobCard}
        >
          <div style={styles.jobHeader}>
            <div style={{ flex: 1 }}>
              <h3 style={styles.jobTitle}>
                <span style={styles.jobCompany}>{job.company}</span>
                <span style={{ color: "#d1d5db", fontWeight: "400" }}> • </span>
                <span style={styles.jobRole}>{job.role}</span>
              </h3>
            </div>
            <select
              value={job.status}
              onChange={(e) => updateStatus(job._id, e.target.value)}
              style={{
                ...styles.statusBadge,
                ...getStatusStyle(job.status),
                border: "none",
                cursor: "pointer"
              }}
            >
              <option>Interested</option>
              <option>Applied</option>
              <option>Interviewing</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
          </div>

          <div style={styles.jobDetails}>
            {job.location && (
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>📍 Location</span>
                <span style={styles.detailValue}>{job.location}</span>
              </div>
            )}

            {job.dueDate && (
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>📅 Deadline</span>
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
                <span style={styles.detailLabel}>💰 Salary</span>
                <span style={styles.detailValue}>{job.salary}</span>
              </div>
            )}

            {job.outcome && job.outcome !== 'Pending' && (
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>📊 Outcome</span>
                <span style={styles.detailValue}>{job.outcome}</span>
              </div>
            )}

            {job.jobUrl && (
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>🔗 Link</span>
                <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#1a6ed6", fontWeight: "500" }}>
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
                <strong style={{ color: "#1e40af" }}>Notes</strong>
                <div style={styles.notesText}>{job.notes}</div>
              </div>
            )}

            <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <button
                  onClick={() => onEditJob(job)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: "1px solid #1a6ed6",
                    background: "#ffffff",
                    color: "#1a6ed6",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={async () => {
                    const token = localStorage.getItem("token");
                    if (!token) return;
                    await fetch(`/api/jobs/${job._id}`, {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    onJobDeleted();
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: "1px solid #dc2626",
                    background: "#ffffff",
                    color: "#dc2626",
                    cursor: "pointer",
                    fontWeight: "600",
                    marginLeft: "1.5rem"
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
              {(() => {
                const badge = getDeadlineBadge(job.dueDate, job.status);
                return badge ? (
                  <span style={{
                    padding: "0.25rem 0.6rem",
                    borderRadius: "999px",
                    fontSize: "0.8em",
                    fontWeight: "600",
                    backgroundColor: badge.bg,
                    color: badge.color,
                    marginRight: "0.5rem",
                  }}>
                    ⚠️ {badge.label}
                  </span>
                ) : null;
              })()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
