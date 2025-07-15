import express, { Request, Response } from 'express';
import sgMail from '@sendgrid/mail';

const router = express.Router();

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.error('SENDGRID_API_KEY is not set. The contact form will not be able to send emails.');
}

router.post('/', async (req: Request, res: Response) => {
  if (!process.env.SENDGRID_API_KEY) {
    return res.status(500).json({ message: 'Server configuration error: Missing SendGrid API Key.' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const msg = {
    to: 'your-client-email@example.com', // IMPORTANT: Replace with your client's actual email
    from: 'noreply@yourdomain.com', // IMPORTANT: Replace with a verified sender in SendGrid
    subject: `New Contact Form Submission from ${name}`,
    text: `You have received a new message from your website contact form.\n\nName: ${name}\nEmail: ${email}\nMessage: \n${message}`,
    html: `<strong>You have received a new message from your website contact form.</strong><br><br><strong>Name:</strong> ${name}<br><strong>Email:</strong> ${email}<br><strong>Message:</strong><br><p>${message}</p>`,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending message.' });
  }
});

export default router;