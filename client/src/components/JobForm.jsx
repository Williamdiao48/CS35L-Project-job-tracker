import { useState, useEffect } from 'react';

const formStyles = {
  form: {
    display: 'grid',
    gap: '1.5rem'
  },
  inputGroup: {
    display: 'grid',
    gap: '0.65rem'
  },
  label: {
    fontWeight: '600',
    color: '#000000',
    fontSize: '0.95em',
    display: 'block'
  },
  input: {
    padding: '0.75rem 1rem',
    border: '1.5px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '1em',
    fontFamily: 'inherit',
    color: '#000000',
    backgroundColor: '#ffffff',
    transition: 'all 0.25s ease',
    width: '100%',
    boxSizing: 'border-box'
  },
  inputFocus: {
    borderColor: '#1a6ed6',
    boxShadow: '0 0 0 4px rgba(26, 110, 214, 0.1)',
    outline: 'none'
  },
  submitButton: {
    padding: '0.85rem 1.5rem',
    background: '#1a6ed6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1em',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'all 0.3s ease',
    width: '100%',
    boxSizing: 'border-box'
  }
};

export default function JobForm({ onCreated, editingJob }) {
  const [form, setForm] = useState({
    company: '',
    role: '',
    status: 'Applied',
    location: '',
    dueDate: '',
    outcome: 'Pending',
    tags: '',
    jobUrl: '',
    notes: '',
    salary: ''
  });

  useEffect(() => {
    if (editingJob) {
      setForm({
        company: editingJob.company || "",
        role: editingJob.role || "",
        status: editingJob.status || "Applied",
        location: editingJob.location || "",
        dueDate: editingJob.dueDate ? editingJob.dueDate.substring(0,10) : "",
        outcome: editingJob.outcome || "Pending",
        tags: editingJob.tags ? editingJob.tags.join(", ") : "",
        jobUrl: editingJob.jobUrl || "",
        notes: editingJob.notes || "",
        salary: editingJob.salary || ""
      });
    }
  }, [editingJob]);


  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Error: You must be logged in to add a job.");
      setLoading(false);
      return;
    }

    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
      dueDate: form.dueDate ? form.dueDate + 'T00:00:00' : form.dueDate
    };

    try {
      const url = editingJob
        ? `/api/jobs/${editingJob._id}`
        : '/api/jobs';

        const method = editingJob ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || errorData.message || 'Failed to create job');
      }
      const job = await res.json();

      setForm({
        company: '',
        role: '',
        status: 'Applied',
        location: '',
        dueDate: '',
        outcome: 'Pending',
        tags: '',
        jobUrl: '',
        notes: '',
        salary: ''
      });

      if (onCreated) onCreated(job);

    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles.form}>
      <div style={formStyles.inputGroup}>
        <label style={formStyles.label}>Company *</label>
        <input
          style={formStyles.input}
          name="company"
          placeholder="Enter company name"
          value={form.company}
          onChange={handleChange}
          onFocus={(e) => Object.assign(e.target.style, formStyles.inputFocus)}
          onBlur={(e) => Object.assign(e.target.style, { boxShadow: 'none', borderColor: '#e5e7eb' })}
          required
        />
      </div>

      <div style={formStyles.inputGroup}>
        <label style={formStyles.label}>Job Role *</label>
        <input
          style={formStyles.input}
          name="role"
          placeholder="e.g., Software Engineer"
          value={form.role}
          onChange={handleChange}
          onFocus={(e) => Object.assign(e.target.style, formStyles.inputFocus)}
          onBlur={(e) => Object.assign(e.target.style, { boxShadow: 'none', borderColor: '#e5e7eb' })}
          required
        />
      </div>

      <div style={formStyles.inputGroup}>
        <label style={formStyles.label}>Application Status</label>
        <select 
          style={formStyles.input}
          name="status" 
          value={form.status} 
          onChange={handleChange}
          onFocus={(e) => Object.assign(e.target.style, formStyles.inputFocus)}
          onBlur={(e) => Object.assign(e.target.style, { boxShadow: 'none', borderColor: '#e5e7eb' })}
        >
          <option>Interested</option>
          <option>Applied</option>
          <option>Interviewing</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
      </div>

      <div style={formStyles.inputGroup}>
        <label style={formStyles.label}>Location</label>
        <input
          style={formStyles.input}
          name="location"
          placeholder="e.g., San Francisco, CA"
          value={form.location}
          onChange={handleChange}
          onFocus={(e) => Object.assign(e.target.style, formStyles.inputFocus)}
          onBlur={(e) => Object.assign(e.target.style, { boxShadow: 'none', borderColor: '#e5e7eb' })}
        />
      </div>

      <div style={formStyles.inputGroup}>
        <label style={formStyles.label}>Application Deadline</label>
        <input
          style={formStyles.input}
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={handleChange}
          onFocus={(e) => Object.assign(e.target.style, formStyles.inputFocus)}
          onBlur={(e) => Object.assign(e.target.style, { boxShadow: 'none', borderColor: '#e5e7eb' })}
        />
      </div>

      <div style={formStyles.inputGroup}>
        <label style={formStyles.label}>Outcome</label>
        <select 
          style={formStyles.input}
          name="outcome" 
          value={form.outcome} 
          onChange={handleChange}
          onFocus={(e) => Object.assign(e.target.style, formStyles.inputFocus)}
          onBlur={(e) => Object.assign(e.target.style, { boxShadow: 'none', borderColor: '#e5e7eb' })}
        >
          <option>Pending</option>
          <option>Accepted</option>
          <option>Rejected</option>
        </select>
      </div>

      <div style={formStyles.inputGroup}>
        <label style={formStyles.label}>Tags</label>
        <input
          style={formStyles.input}
          name="tags"
          placeholder="e.g., backend, python, startup (separated by commas)"
          value={form.tags}
          onChange={handleChange}
          onFocus={(e) => Object.assign(e.target.style, formStyles.inputFocus)}
          onBlur={(e) => Object.assign(e.target.style, { boxShadow: 'none', borderColor: '#e5e7eb' })}
        />
      </div>

      <div style={formStyles.inputGroup}>
        <label style={formStyles.label}>Job URL</label>
        <input
          style={formStyles.input}
          name="jobUrl"
          placeholder="https://..."
          value={form.jobUrl}
          onChange={handleChange}
          onFocus={(e) => Object.assign(e.target.style, formStyles.inputFocus)}
          onBlur={(e) => Object.assign(e.target.style, { boxShadow: 'none', borderColor: '#e5e7eb' })}
        />
      </div>

      <div style={formStyles.inputGroup}>
        <label style={formStyles.label}>Salary</label>
        <input
          style={formStyles.input}
          name="salary"
          placeholder="e.g., $80,000 - $120,000"
          value={form.salary}
          onChange={handleChange}
          onFocus={(e) => Object.assign(e.target.style, formStyles.inputFocus)}
          onBlur={(e) => Object.assign(e.target.style, { boxShadow: 'none', borderColor: '#e5e7eb' })}
        />
      </div>

      <div style={formStyles.inputGroup}>
        <label style={formStyles.label}>Notes</label>
        <textarea
          style={{...formStyles.input, minHeight: '120px', resize: 'vertical'}}
          name="notes"
          placeholder="Add any additional notes about this application..."
          value={form.notes}
          onChange={handleChange}
          onFocus={(e) => Object.assign(e.target.style, formStyles.inputFocus)}
          onBlur={(e) => Object.assign(e.target.style, { boxShadow: 'none', borderColor: '#e5e7eb' })}
        />
      </div>

      <button 
        type="submit" 
        style={{
          ...formStyles.submitButton,
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
        disabled={loading}
      >
        {loading
          ? (editingJob ? 'Updating Application...' : 'Creating Application...')
          : (editingJob ? 'Update Job Application' : 'Create Job Application')}
      </button>
    </form>
  );
}
