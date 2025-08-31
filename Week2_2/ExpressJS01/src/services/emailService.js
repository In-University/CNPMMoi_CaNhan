require("dotenv").config();
const nodemailer = require('nodemailer');

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

const sendOTPEmail = async (email, otp) => {
    try {
        const transporter = createTransporter();
        
        console.log(`Sending OTP ${otp} to ${email}...`);
        
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Reset Password OTP',
            html: `
                <h2>Reset Password OTP</h2>
                <p>Your OTP code is: <strong>${otp}</strong></p>
                <p>This OTP expires in 10 minutes.</p>
            `,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result.messageId);
        return { success: true };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error: error.message };
    }
};

const testEmailConnection = async () => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        console.log('✅ Email service ready');
        return true;
    } catch (error) {
        console.error('❌ Email service error:', error.message);
        return false;
    }
};

module.exports = { sendOTPEmail, testEmailConnection };
