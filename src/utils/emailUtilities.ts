import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Use this for testing
      to: options.email,
      subject: options.subject,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">${options.subject}</h2>
        <p style="color: #666; line-height: 1.6;">${options.message.replace(/\n/g, '<br>')}</p>
      </div>`,
    });

    if (error) {
      console.error('Email send error:', error);
      throw new Error('Failed to send email');
    }

    console.log('Email sent successfully:', data);
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};