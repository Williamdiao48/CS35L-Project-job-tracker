import { useState } from 'react';

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

    // convert tags from "a, b, c" → ["a","b","c"]
    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
    };

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to create job');

      const job = await res.json();

      // reset form
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
        salary: '',
        owner: ''
      });

      // notify parent
      if (onCreated) onCreated(job);

    } catch (err) {
      console.error(err);
      alert('Could not create job');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
      <input
        name="company"
        placeholder="Company"
        value={form.company}
        onChange={handleChange}
        required
      />
      <input
        name="role"
        placeholder="Role"
        value={form.role}
        onChange={handleChange}
        required
      />

      <select name="status" value={form.status} onChange={handleChange}>
        <option>Interested</option>
        <option>Applied</option>
        <option>Interviewing</option>
        <option>Offer</option>
        <option>Rejected</option>
      </select>

      <input
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
      />

      <input
        name="dueDate"
        type="date"
        value={form.dueDate}
        onChange={handleChange}
      />

      <select name="outcome" value={form.outcome} onChange={handleChange}>
        <option>Pending</option>
        <option>Accepted</option>
        <option>Rejected</option>
      </select>

      <input
        name="tags"
        placeholder="Tags (comma separated)"
        value={form.tags}
        onChange={handleChange}
      />

      <input
        name="jobUrl"
        placeholder="Job URL"
        value={form.jobUrl}
        onChange={handleChange}
      />

      <input
        name="salary"
        placeholder="Salary"
        value={form.salary}
        onChange={handleChange}
      />

      <input
        name="owner"
        placeholder="Owner (user id)"
        value={form.owner}
        onChange={handleChange}
      />

      <textarea
        name="notes"
        placeholder="Notes"
        value={form.notes}
        onChange={handleChange}
      />

      <button type="submit">Create Job</button>
    </form>
  );
}
