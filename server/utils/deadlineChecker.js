import Job from '../models/jobModel.js';
import { sendDeadlineReminder } from '../services/emailService.js';

export const checkUpcomingDeadlines = async () => {
    try {
        console.log('🔍 Checking for upcoming deadlines...');
    
        const now = new Date();

        // Get tomorrow's date (the day we're checking deadlines for)
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0); // Start of tomorrow

        // Get end of tomorrow
        const endOfTomorrow = new Date(tomorrow);
        endOfTomorrow.setHours(23, 59, 59, 999);

         console.log(`Looking for jobs due on ${tomorrow.toDateString()}`);

        // Find jobs with deadlines from start of today through the next 24 hours
        const jobsWithDeadlines = await Job.find({
            dueDate: {
                $gte: tomorrow,
                $lte: endOfTomorrow
            },
            status: { $ne: 'Rejected' } // Don't send reminders for rejected applications
        }).populate('owner', 'email username');

        console.log(`📧 Found ${jobsWithDeadlines.length} jobs with upcoming deadlines`);

        // Send email for each job
        for (const job of jobsWithDeadlines) {
            if (job.owner && job.owner.email) {
                console.log(`Sending reminder to ${job.owner.email} for ${job.company} - ${job.role}`);
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