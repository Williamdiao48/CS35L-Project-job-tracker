import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { checkUpcomingDeadlines } from '../utils/deadlineChecker.js';
import { sendTestEmail } from '../services/emailService.js';

const router = express.Router();

// Manual trigger for deadline check (for testing)
router.post('/check-deadlines', authMiddleware, async (req, res) => {
    try {
        const result = await checkUpcomingDeadlines();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Test email endpoint
router.post('/test-email', authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        // Get user's email from database
        const User = (await import('../models/userModel.js')).default;
        const userData = await User.findById(user.id).select('email');
    
        if (!userData || !userData.email) {
            return res.status(400).json({ error: 'User email not found' });
        }
    
        const result = await sendTestEmail(userData.email);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;