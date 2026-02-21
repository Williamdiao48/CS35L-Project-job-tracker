import express from "express";
import User from "../models/userModel.js";
import mongoose from 'mongoose';

const router = express.Router();

router.post("/register", async(req, res)=>{
    try{
    const {username, password, email} = req.body;
    if(!username||!password||!email){
        return res.status(400).json({message: "Please provide all requested informatino"});
    }
    const user = new User({ username, password, email });
    await user.save();
    res.status(201).json({ message: "User registered successfully!" });
    } catch(err){
        return res.status(400).json({ error: "Email or Username already exists" });
    }});

router.post("/login", async(req,res)=>{
    try{
        const {username, password} = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

        return res.json({message: "Login successful", user: { id: user._id, username: user.username }})
    }catch(err){
        return res.status(500).json({ error: "Server Error"});
    }
});



export default router;