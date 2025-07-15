import { Router, Request, Response } from "express";
import { MailService } from '@sendgrid/mail';

const contactRoutes = Router();
const mailService = new MailService();

const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
  mailService.setApiKey(apiKey);
} else {
  console.warn('CRITICAL: SENDGRID_API_KEY is not set. Contact form will not work.');
}

contactRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }
    
    if (!apiKey) {
      throw new Error("Server is not configured to send email.");
    }

    const [firstName = "", ...rest] = name.split(" ");
    const lastName = rest.join(" ") || "(no last name)";
    
    const adminEmail = 'YOUR_ACTUAL_ADMIN_EMAIL@DOMAIN.COM'; // <<< CHANGE THIS
    const fromEmail = 'hello@celiadunsmorecounselling.com.au';
    const adminSubject = `New Contact Form Submission from ${firstName} ${lastName}`;
    const adminText = `Name: ${firstName} ${lastName}\nEmail: ${email}\nMessage: ${message}`;
    
    await mailService.send({ to: adminEmail, from: fromEmail, subject: adminSubject, text: adminText });

    const clientSubject = `We've Received Your Message`;
    const clientHtml = `<p>Dear ${firstName}, thank you for your message. I will get back to you shortly.</p>`;
    await mailService.send({ to: email, from: fromEmail, subject: clientSubject, html: clientHtml });
    
    res.status(200).json({ message: "Message sent successfully!" });

  } catch (error) {
    console.error("Contact form processing error:", error);
    res.status(500).json({ error: "Sorry, an internal error occurred." });
  }
});

export default contactRoutes;