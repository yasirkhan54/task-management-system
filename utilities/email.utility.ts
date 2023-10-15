import nodemailer from "nodemailer";
import fs from 'fs';
import path from 'path';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '0'),
  secure: process.env.EMAIL_SECURE === 'true' ? true : false,
  auth: {
    user: process.env.EMAIL_HOST_USER,
    pass: process.env.EMAIL_HOST_PASSWORD
  }
});

export const SEND_EMAIL = async (to: string, subject: string, text: string) => {
  return await transporter.sendMail({ from: '"Yasir Khan" <yasir.khan@devjins.com>', to, subject, text })
}

export const SEND_VERIFICATION_EMAIL = async (redirect_url: string, to: string, verification_code: string) => {
  // Load the email template file
  const templatePath = path.join(__dirname, '../templates/email_verification_template.html');
  const template = fs.readFileSync(templatePath, 'utf-8');
  const verificationLink = `${redirect_url}?email=${to}&verification_code=${verification_code}}`

  try {
    // Send the email with the rendered HTML template
    const mailOptions = {
      from: '"Yasir Khan" <yasir.khan@devjins.com>',
      to,
      subject: 'Email Verification',
      html: template.replace('{{verificationLink}}', verificationLink).replace('{{verificationCode}}', verification_code)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export const SEND_FORGOT_PASSWORD_EMAIL = async (redirect_url: string, to: string, verification_code: string) => {
  // Load the email template file
  const templatePath = path.join(__dirname, '../templates/forgot_password_template.html');
  const template = fs.readFileSync(templatePath, 'utf-8');
  const verificationLink = `${redirect_url}?email=${to}&verification_code=${verification_code}}`

  try {
    // Send the email with the rendered HTML template
    const mailOptions = {
      from: '"Yasir Khan" <yasir.khan@devjins.com>',
      to,
      subject: 'Forgot Password',
      html: template.replace('{{verificationLink}}', verificationLink).replace('{{verificationCode}}', verification_code)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Forgot password email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export const SEND_UPDATE_PASSWORD_EMAIL = async (to: string) => {
  // Load the email template file
  const templatePath = path.join(__dirname, '../templates/update_password_template.html');
  const template = fs.readFileSync(templatePath, 'utf-8');

  try {
    // Send the email with the rendered HTML template
    const mailOptions = {
      from: '"Yasir Khan" <yasir.khan@devjins.com>',
      to,
      subject: 'Password Updated',
      html: template
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Update password email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}