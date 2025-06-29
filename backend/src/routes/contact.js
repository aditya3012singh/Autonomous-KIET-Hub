import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer"; // ✅ Make sure this is imported

dotenv.config();
const router = express.Router();

router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Please fill in all fields." });
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.TO_EMAIL,
      subject: "New Message from NoteNexus Contact Form",
      html: `
        <h3>📩 New Contact Request</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send message. Please try again later." });
  }
});

export default router;
