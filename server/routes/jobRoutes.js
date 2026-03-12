import express from 'express';
import Job from '../models/jobModel.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { discoverJobs } from '../controllers/jobController.js';

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
  try {
    const userId = req.user.id || req.user._id;
    const search = req.query.search;
    const status = req.query.status;
    const sort = req.query.sort;
    
    let query = { owner: userId };
    if (status) { 
      query.status = status; 
    }

    if (search) {
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
        { outcome: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }
    
    let sortOption = { createdAt: -1 }; // default newest

    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    } else if (sort === "companyAZ") {
      sortOption = { company: 1 };
    } else if (sort === "companyZA") {
      sortOption = { company: -1 };
    }

    const jobs = await Job.find(query).sort(sortOption);


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


// Update a job
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { company, role, status, dueDate,
      location, outcome, tags, jobUrl,notes, salary
    } = req.body;

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    const updateData = {
      company, role, status, dueDate, location, outcome,
      tags, jobUrl, notes, salary
    };

    const updated = await Job.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Update failed, try again' });
    }

    return res.json(updated);

  } catch (err) {
    console.error("Update job error:", err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Delete a job
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    const removed = await Job.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Job not found' });
    return res.json({ message: 'Job deleted' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get Jobs from APIs Route
// Accessible through GET /api/jobs/discover?title=Engineer&location=remote
router.get('/discover', authMiddleware, discoverJobs);

export default router;
