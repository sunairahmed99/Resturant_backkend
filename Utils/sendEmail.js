import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendOrderStatusEmail = async (email, orderNumber, status, amount, customerName) => {
    try {
        const user = process.env.Gmailuser || process.env.EMAIL_USER;
        const pass = process.env.Gmailpassword || process.env.EMAIL_PASS;
        const restaurantName = "ZEST & ZEST Restaurant"; // Direct branding

        if (!user || !pass) {
            console.warn('Email credentials not found in environment variables. Skipped sending email.');
            return;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: user,
                pass: pass,
            },
        });

        let subject = `Update on your Order #${orderNumber} - ${restaurantName}`;
        let htmlBody = `
            <h3>Hello ${customerName || 'Valued Customer'},</h3>
            <p>Your order <strong>#${orderNumber}</strong> for <strong>Rs ${amount}</strong> at <strong>${restaurantName}</strong> has been updated.</p>
            <p>The current status is now: <strong>${status}</strong>.</p>
        `;

        // Customize content based on specific statuses if needed
        if (status === 'Approved') {
            subject = `Your Order #${orderNumber} has been Approved! - ${restaurantName}`;
            htmlBody += `<p>It is now being processed.</p>`;
        } else if (status === 'Rejected') {
            subject = `Update on your Order #${orderNumber} - ${restaurantName}`;
            htmlBody = `
                <h3>Hello ${customerName || 'Valued Customer'},</h3>
                <p>We regret to inform you that your order <strong>#${orderNumber}</strong> for <strong>Rs ${amount}</strong> at <strong>${restaurantName}</strong> has been <strong>Rejected</strong>.</p>
                <p>If you have any questions, please contact our support team.</p>
            `;
        } else if (status === 'Delivered') {
            subject = `Your Order #${orderNumber} has been Delivered! - ${restaurantName}`;
            htmlBody = `
                <h3>Hello ${customerName || 'Valued Customer'}!</h3>
                <p>We are happy to inform you that your order <strong>#${orderNumber}</strong> from <strong>${restaurantName}</strong> has been <strong>Delivered</strong> successfully.</p>
                <p>We hope you enjoy it!</p>
            `;
        } else if (status === 'Confirmed') {
            subject = `Your Order #${orderNumber} is Confirmed - ${restaurantName}`;
            htmlBody += `<p>We are starting to prepare your order.</p>`;
        } else if (status === 'Preparing') {
            subject = `Your Order #${orderNumber} is Preparing - ${restaurantName}`;
            htmlBody += `<p>Your order is currently being prepared by our team.</p>`;
        } else if (status === 'Out for Delivery') {
            subject = `Your Order #${orderNumber} is Out for Delivery - ${restaurantName}`;
            htmlBody += `<p>Your order is on its way!</p>`;
        } else if (status === 'Cancelled') {
            subject = `Your Order #${orderNumber} is Cancelled - ${restaurantName}`;
            htmlBody = `
                <h3>Hello ${customerName || 'Valued Customer'},</h3>
                <p>Your order <strong>#${orderNumber}</strong> at <strong>${restaurantName}</strong> has been <strong>Cancelled</strong>.</p>
            `;
        }

        htmlBody += `
            <br>
            <p>Best regards,</p>
            <p><strong>Team ${restaurantName}</strong></p>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            html: htmlBody,
        };

        const info = await transporter.sendMail(mailOptions);

    } catch (error) {
        console.error('Error sending email:', error);
    }
};
