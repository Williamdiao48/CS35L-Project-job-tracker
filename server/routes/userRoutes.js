import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();
const client = new OAuth2Client("168412292658-d46k9rt2thje683s53nul3kksv6oke28.apps.googleusercontent.com");

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d' // Token expires in 7 days
    });
};

// Register Route
router.post("/register", async(req, res)=>{
    try{
    const {username, password, email} = req.body;
    if(!username||!password||!email){
        return res.status(400).json({message: "Please provide all requested informatino"});
    }
    const user = new User({username, password, email});
    await user.save();
    // Generate token for new user
    const token = generateToken(user._id);
    res.status(201).json({ 
        message: "User registered successfully!",
        token, 
        user: { id: user._id, username: user.username, email: user.email }
    });
    } catch(err){
        console.error("REGISTER ERROR:", err);
        return res.status(400).json({ error: err.message });
    }});

// Login Route
router.post("/login", async(req,res)=>{
    try{
        const {username, password} = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

        // Generate token
        const token = generateToken(user._id);

        return res.json({
            message: "Login successful", 
            token,
            user: { id: user._id, username: user.username, email: user.email }
        })
    }catch(err){
        return res.status(500).json({ error: "Server Error"});
    }
});

// Google Login Route
router.post("/google-login", async (req, res) => {
    try {
      const { token } = req.body;
  
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: "168412292658-d46k9rt2thje683s53nul3kksv6oke28.apps.googleusercontent.com"
      });
  
      const payload = ticket.getPayload();
  
      const email = payload.email;
      const name = payload.name;
  
      let user = await User.findOne({ email });
  
      // If user doesn't exist, create one
      if (!user) {
        user = new User({
            username: email.split("@")[0], // safer way to save username
            email,
            password: Math.random().toString(36) // dummy password
        });
  
        await user.save();
      }
  
      const tokenJWT = generateToken(user._id);
  
      res.json({
        message: "Google login successful",
        token: tokenJWT,
        user: { id: user._id, username: user.username, email: user.email }
      });
  
    } catch (err) {
      console.error("Google login error:", err);
      res.status(401).json({ error: "Invalid Google token" });
    }
  });


// Protected Route Example - Get User Profile
router.get("/profile", authMiddleware, async(req, res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ error: "User not found" });
        
        res.json({ user });
    }catch(err){
        res.status(500).json({ error: "Server Error" });
    }
});

export default router;