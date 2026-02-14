import express from 'express';
import Job from '../models/jobModel.js';

const router = express.Router();

// Create a new job
router.post('/', async (req, res) => {
  try {
    const {
      company,
      role,
      status,
      appliedDate,
      dueDate,
      location,
      outcome,
      tags,
      owner,
      jobUrl,
      notes,
      salary
    } = req.body;

    if (!company || !role || !owner) {
      return res.status(400).json({ message: 'company, role and owner are required' });
    }

    const job = new Job({
      company,
      role,
      status,
      appliedDate,
      dueDate,
      location,
      outcome,
      tags,
      owner,
      jobUrl,
      notes,
      salary
    });

    await job.save();
    return res.status(201).json(job);
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Get jobs (optionally filter by owner)
router.get('/', async (req, res) => {
  try {
    const { owner } = req.query;
    const filter = {};
    if (owner) filter.owner = owner;
    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    return res.json(jobs);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Update a job
router.put('/:id', async (req, res) => {
  try {
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Job not found' });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Delete a job
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Job.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Job not found' });
    return res.json({ message: 'Job deleted' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
