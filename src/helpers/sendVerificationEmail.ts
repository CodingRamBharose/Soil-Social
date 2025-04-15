import resend from '@/config/resend';
import VerificationEmail from "../../emails/VerificationEmail";

interface SendVerificationEmailParams {
  email: string;
  username: string;
  otp: string;
}

export const sendVerificationEmail = async ({ email, username, otp }: SendVerificationEmailParams) => {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@codingrambharose.me',
      to: email,
      subject: 'Verify your email address',
      react: VerificationEmail({ username, otp }),
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error };
  }
};
