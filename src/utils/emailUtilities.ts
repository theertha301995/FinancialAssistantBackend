import nodemailer from 'nodemailer';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Email options
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME || 'Your App'} <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #333;">${options.subject}</h2>
      <p style="color: #666; line-height: 1.6;">${options.message.replace(/\n/g, '<br>')}</p>
    </div>`,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};