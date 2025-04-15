import { Html, Head, Preview, Body, Container, Text, Button } from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your verification code for SoilSocial</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>Hi {username},</Text>
          <Text style={paragraph}>
            Thank you for registering with SoilSocial. Please use the following verification code to complete your registration:
          </Text>
          <Text style={code}>{otp}</Text>
          <Text style={paragraph}>
            This code will expire in 10 minutes. If you didn't request this, please ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.5',
  marginBottom: '20px',
};

const code = {
  backgroundColor: '#f5f5f5',
  padding: '10px 15px',
  borderRadius: '4px',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '20px 0',
};