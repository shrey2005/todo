const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function sendEmail(payload) {
    const { to, subject, html } = payload;
    const mailOptions = {
        from: process.env.SMTP_USER,
        to,
        subject,
        text: html,
    };

    return transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
