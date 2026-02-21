import express from 'express';
import Job from '../models/jobModel.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new job
router.post('/', authMiddleware, async (req, res) => {
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
      jobUrl,
      notes,
      salary
    } = req.body;


    const ownerId = req.user.id || req.user._id;

    if (!company || !role || !ownerId) {
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
      owner: ownerId,
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


router.get('/', authMiddleware, async (req, res) => {
  console.log("--- GET Jobs Route Hit ---");
  
  try {
    // Check if req.user exists from the middleware
    if (!req.user) {
      console.error("Error: req.user is missing. Check authMiddleware.");
      return res.status(401).json({ message: "Not authorized, no user data" });
    }

    // Try to find jobs
    const jobs = await Job.find({ owner: req.user.id || req.user._id });
    
    console.log(`Success: Found ${jobs.length} jobs for user ${req.user.id || req.user._id}`);
    res.json(jobs);

  } catch (error) {
    // THIS prints the actual error to your terminal (Node console)
    console.error("DETAILED BACKEND ERROR:", error.message);
    res.status(500).json({ 
      message: "Server Error", 
      details: error.message 
    });
  }
});

// Get jobs (filter by owner, optionally filter by other categories (can be added as needed))
/*router.get('/', authMiddleware, async (req, res) => {
  try {
    const ownerId = req.user.id || req.user._id;
    const filter = { owner: ownerId };
    const { status, company, role } = req.query;
    if (!owner) {
        return res.status(400).json({ error: 'Owner ID is required.' });
    }
    if (status) filter.status = status;
    if (company) filter.company = new RegExp(company, 'i');
    if (role) filter.role = new RegExp(role, 'i');

    //const jobs = await Job.find(filter).sort({ createdAt: -1 });
    console.log(`Database found ${jobs.length} jobs for this user`);
    const jobs = await Job.find({ owner: req.user.id || req.user._id });
    return res.json(jobs);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Update a job
router.put('/:id', async (req, res) => {
  try {
    const { company, role, status, dueDate, tags, jobUrl, notes, salary } = req.body;
    const updateData = { company, role, status, dueDate, tags, jobUrl, notes, salary };
    const updated = await Job.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Job not found' });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});*/

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
