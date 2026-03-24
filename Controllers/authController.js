import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Admin from '../Models/Admin.js';
import sendEmail from '../utils/email.js';

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
};

export const registerAdmin = async (req, res) => {
    try {
        const { name, email, phone, password, cpassword } = req.body;

        if (!name || !email || !phone || !password || !cpassword) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if (password !== cpassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        const newAdmin = await Admin.create({
            name,
            email,
            phone,
            password,
            isVerified: false,
        });

        // Generate Registration OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        newAdmin.otp = hashedOtp;
        newAdmin.otpExpires = Date.now() + 10 * 60 * 1000;
        await newAdmin.save();



        // import('fs').then(fs => fs.writeFileSync('otp.txt', otp)).catch(() => {});

        const message = `Hello ${name},\n\nYour admin registration code is: ${otp}\nThis code will expire in 10 minutes.`;

        try {
            await sendEmail({
                email: newAdmin.email,
                subject: 'Admin Registration Verification Code',
                message: message,
            });

            return res.status(200).json({
                status: 'success',
                message: 'Email send successfully',
            });
        } catch (err) {
            return res.status(500).json({
                status: 'fail',
                message: 'There was an error sending the email. Try again later!',
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginRequest = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // 1. Check if admin exists and password is correct
        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin || !(await admin.correctPassword(password, admin.password))) {
            return res.status(401).json({ message: 'Incorrect email or password' });
        }

        // 2. Check if admin is verified
        if (!admin.isVerified) {
            return res.status(401).json({ message: 'Your email is not verified. Please verify your account first.' });
        }

        // 3. Generate random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        // 4. Set OTP and Expiration in Admin doc
        admin.otp = hashedOtp;
        admin.otpExpires = Date.now() + 10 * 60 * 1000;
        await admin.save({ validateBeforeSave: false }); // Skip validation to ignore password rules



        // import('fs').then(fs => fs.writeFileSync('otp.txt', otp)).catch(() => {});

        // 5. Send OTP via email
        const message = `Welcome back ${admin.name},\n\nYour admin login code is: ${otp}\nThis code will expire in 10 minutes.`;

        try {
            await sendEmail({
                email: admin.email,
                subject: 'Your Admin Login OTP Code',
                message: message,
            });

            return res.status(200).json({
                status: 'success',
                message: 'Email send successfully',
            });
        } catch (err) {
            return res.status(500).json({
                status: 'fail',
                message: 'There was an error sending the email. Try again later!',
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyRegistration = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Please provide email and OTP' });
        }

        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        const admin = await Admin.findOne({
            email,
            otp: hashedOtp,
            otpExpires: { $gt: Date.now() },
        });

        if (!admin) {
            return res.status(401).json({ message: 'Invalid or expired OTP' });
        }

        // 1. Mark as verified
        admin.isVerified = true;

        // 2. Clear OTP fields
        admin.otp = undefined;
        admin.otpExpires = undefined;
        await admin.save({ validateBeforeSave: false });

        // 3. Send token to client
        const token = signToken(admin._id);

        res.status(200).json({
            status: 'success',
            message: 'Account verified successfully!',
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyLogin = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Please provide email and OTP' });
        }

        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        const admin = await Admin.findOne({
            email,
            otp: hashedOtp,
            otpExpires: { $gt: Date.now() },
            isVerified: true // Ensure they are verified during login verify
        });

        if (!admin) {
            return res.status(401).json({ message: 'Invalid or expired OTP' });
        }

        // 1. Clear OTP fields
        admin.otp = undefined;
        admin.otpExpires = undefined;
        await admin.save({ validateBeforeSave: false });

        // 2. Send token to client
        const token = signToken(admin._id);

        res.status(200).json({
            status: 'success',
            message: 'Login successful!',
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
