import Job from '../models/jobModel.js';
import { sendDeadlineReminder } from '../services/emailService.js';

export const checkUpcomingDeadlines = async () => {
    try {
        console.log('🔍 Checking for upcoming deadlines...');
    
        const now = new Date();
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);
        const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        // Find jobs with deadlines from start of today through the next 24 hours
        const jobsWithDeadlines = await Job.find({
            dueDate: {
                $gte: startOfToday,
                $lte: in24Hours
            },
            status: { $ne: 'Rejected' } // Don't send reminders for rejected applications
        }).populate('owner', 'email username');

        console.log(`📧 Found ${jobsWithDeadlines.length} jobs with upcoming deadlines`);

        // Send email for each job
        for (const job of jobsWithDeadlines) {
            if (job.owner && job.owner.email) {
                await sendDeadlineReminder(
                    job.owner.email,
                    job.owner.username,
                    job
                );
            }
        }

        return {
            success: true,
            count: jobsWithDeadlines.length,
            message: `Sent ${jobsWithDeadlines.length} deadline reminders`
        };

    } catch (error) {
        console.error('❌ Error checking deadlines:', error);
        return {
            success: false,
            error: error.message
        };
    }
};