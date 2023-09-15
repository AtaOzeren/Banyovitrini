const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async (data, req, res) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MP,
        }
    });

    try {
        // send mail with defined transport object
        const info = transporter.sendMail({
            from: '"Hey 👻" <abc@gmail.com>',
            to: data.to,
            subject: data.subject,
            text: data.text,
            html: data.htm,
        });

        console.log("Message sent: %s", info.messageId);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: 'Email could not be sent' });
    }
});

module.exports = sendEmail;
