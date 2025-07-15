import { MailService } from '@sendgrid/mail';

const mailService = new MailService();
const apiKey = process.env.SENDGRID_API_KEY;

if (apiKey) {
  mailService.setApiKey(apiKey);
  console.log('SendGrid API key set successfully.');
} else {
  console.warn('SENDGRID_API_KEY is not set. Email functionality will be disabled.');
}

export async function sendContactConfirmation(firstName: string, lastName: string, email: string, message: string): Promise<boolean> {
  if (!apiKey) {
    console.error('Cannot send email, no API key configured.');
    return false;
  }

  const subject = `We've Received Your Message - Celia Dunsmore Counselling`;
  const fromEmail = 'hello@celiadunsmorecounselling.com.au';
  
  // Email to the person who submitted the form
  const clientHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4EB3A5; margin: 0;">Thank You for Contacting Us</h1>
        <p style="font-size: 18px; color: #666;">Celia Dunsmore Counselling</p>
      </div>
      <div style="background-color: #f7f7f7; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <p>Dear ${firstName} ${lastName},</p>
        <p>Thank you for reaching out. I have received your message and will get back to you as soon as possible, usually within 24-48 hours during business days.</p>
        <div style="margin: 20px 0; padding: 15px; background-color: #ffffff; border-left: 4px solid #4EB3A5; border-radius: 3px;">
          <p><strong>Your message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        <h3 style="color: #4EB3A5;">What happens next?</h3>
        <p>I will review your message and contact you via email or phone. If your matter is urgent, please call me directly at (03) 9123 4567.</p>
      </div>
      <div style="text-align: center; font-size: 14px; color: #888; margin-top: 30px;">
        <p>If you have any questions, please contact us at:</p>
        <p>Email: hello@celiadunsmorecounselling.com.au | Phone: (03) 9123 4567</p>
        <p>© ${new Date().getFullYear()} Celia Dunsmore Counselling. All rights reserved.</p>
      </div>
    </div>
  `;
  const clientText = `Thank You for Contacting Us...`; // A plain text version of the above

  // Notification email to the admin
  const adminSubject = `New Contact Submission from ${firstName} ${lastName}`;
  const adminEmail = 'hello@celiadunsmorecounselling.com.au'; // <<< IMPORTANT: CHANGE THIS
  const adminText = `Name: ${firstName} ${lastName}\nEmail: ${email}\nMessage: ${message}`;
  
  try {
    // Send email to client
    await mailService.send({ to: email, from: fromEmail, subject: subject, html: clientHtml, text: clientText });
    
    // Send notification to admin
    await mailService.send({ to: adminEmail, from: fromEmail, subject: adminSubject, text: adminText });

    console.log(`Contact emails sent for ${email}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}