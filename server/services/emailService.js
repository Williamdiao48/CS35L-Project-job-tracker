import nodemailer from 'nodemailer';

const getTransporter = () => nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

// Send deadline reminder email
export const sendDeadlineReminder = async (userEmail, username, job) => {
    try {
        const transporter = getTransporter();
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: userEmail,
            subject: `⏰ Reminder: ${job.company} Application Deadline Tomorrow`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1a6ed6;">Job Application Deadline Reminder</h2>
                    
                    <p>Hi ${username},</p>
          
                    <p>This is a friendly reminder that your job application deadline is approaching!</p>
          
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #000;">Application Details:</h3>
                        <p><strong>Company:</strong> ${job.company}</p>
                        <p><strong>Role:</strong> ${job.role}</p>
                        <p><strong>Deadline:</strong> ${new Date(job.dueDate).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> ${job.status}</p>
                        ${job.jobUrl ? `<p><strong>Apply Here:</strong> <a href="${job.jobUrl}">${job.jobUrl}</a></p>` : ''}
                    </div>
          
                    <p style="color: #d32f2f; font-weight: bold;">⚠️ Deadline is in 24 hours!</p>
          
                    <p>Make sure to complete your application before the deadline.</p>
          
                    <p>Good luck with your application!</p>
          
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
                    <p style="color: #666; font-size: 12px;">
                        This is an automated reminder from JobTrackr. 
                        You're receiving this because you have an upcoming application deadline.
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${userEmail}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    
    } catch (error) {
    console.error(`❌ Failed to send email to ${userEmail}:`, error.message);
    return { success: false, error: error.message };
    }
};

// Test email function (optional - for testing setup)
export const sendTestEmail = async (toEmail) => {
    try {
        const transporter = getTransporter();
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: toEmail,
            subject: 'Test Email from JobTrackr',
            html: '<h1>Email Setup Successful!</h1><p>Your Gmail integration is working correctly.</p>'
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Test email sent:', info.messageId);
        return { success: true };
        } catch (error) {
        console.error('Test email failed:', error);
        return { success: false, error: error.message };
    }
};