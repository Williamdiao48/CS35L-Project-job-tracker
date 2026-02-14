import express from 'express';
import Job from '../models/jobModel.js';

const router = express.Router();

//Add a new job
router.post("/add", async (req, res)=>{
    const { company, role, status, appliedDate, dueDate, tags, owner, jobUrl, notes, salary } = req.body;
try{
    const newJob = new Job({company, role, status, appliedDate, dueDate, tags, owner, jobUrl, notes, salary});
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);}
    catch(err){
        return res.status(400)({error: "Could not create job: " + err.message})
    }
});

//get all jobs applications for a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const jobs = await Job.find({ owner: req.params.userId });
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//update a job application
router.patch('/update/:id', async(req, res)=>{
    const { company, role, status, dueDate, tags, jobUrl, notes, salary } = req.body;

    try{
        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id, req.body, {new: true});
        res.status(200).json(updatedJob);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});


//delete a job application
router.delete('/delete/:id', async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



