import { useState } from 'react';

const formStyles = {
  form: {
    display: 'grid',
    gap: '1rem'
  },
  inputGroup: {
    display: 'grid',
    gap: '0.5rem'
  },
  label: {
    fontWeight: '500',
    color: '#000000',
    fontSize: '0.95em'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1em',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease'
  },
  submitButton: {
    padding: '0.85rem 1.5rem',
    background: '#1a6ed6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1em',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'all 0.2s ease'
  }
};

export default function JobForm({ onCreated }) {
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
    salary: '',
    owner: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        .filter(Boolean)
    };

    try {
      const res = await fetch('http://localhost:5001/api/jobs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json(); // Capture the server's explanation
        console.log("Server Error Data:", errorData);
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
      console.error("FULL ERROR OBJECT:", err); // Look at this in the browser console!
      alert(`Error: ${err.message}`); // This will tell you if it's a "TypeError" or something else
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
        />
      </div>

      <div style={formStyles.inputGroup}>
        <label style={formStyles.label}>Outcome</label>
        <select 
          style={formStyles.input}
          name="outcome" 
          value={form.outcome} 
          onChange={handleChange}
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
          placeholder="e.g., backend, python, startup"
          value={form.tags}
          onChange={handleChange}
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
        />
      </div>


      <div style={formStyles.inputGroup}>
        <label style={formStyles.label}>Notes</label>
        <textarea
          style={{...formStyles.input, minHeight: '100px', resize: 'vertical'}}
          name="notes"
          placeholder="Add any additional notes about this application..."
          value={form.notes}
          onChange={handleChange}
        />
      </div>

      <button type="submit" style={formStyles.submitButton}>
        Create Job Application
      </button>
    </form>
  );
}
