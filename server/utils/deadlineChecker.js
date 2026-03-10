import Job from '../models/jobModel.js';
import User from '../models/userModel.js';
import { sendDeadlineReminder } from '../services/emailService.js';

export const checkUpcomingDeadlines = async () => {
    try {
        console.log('🔍 Checking for upcoming deadlines...');
    
        // Calculate 24 hours from now
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setHours(now.getHours() + 24);
    
        const dayAfterTomorrow = new Date(now);
        dayAfterTomorrow.setHours(now.getHours() + 25);

        // Find jobs with deadlines in the next 24 hours
        const jobsWithDeadlines = await Job.find({
            dueDate: {
                $gte: tomorrow,
                $lt: dayAfterTomorrow
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