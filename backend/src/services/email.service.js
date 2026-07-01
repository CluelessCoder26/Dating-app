import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      secure: false, // TLS via STARTTLS
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
    this.sender = `"Spark Dating" <${env.SMTP_USER}>`;
  }

  async sendMail(to, subject, html) {
    if (!env.SMTP_USER) {
      logger.warn(`SMTP not configured. Skipping email to ${to}`);
      return;
    }
    try {
      await this.transporter.sendMail({
        from: this.sender,
        to,
        subject,
        html
      });
      logger.info(`Email sent to ${to} (Subject: ${subject})`);
    } catch (err) {
      logger.error(`Failed to send email to ${to}: ${err.message}`);
    }
  }

  async sendWelcomeEmail(to, name) {
    const html = `
      <h1>Welcome to Spark, ${name}!</h1>
      <p>We're excited to have you on board. Set up your profile and start making connections today.</p>
    `;
    return this.sendMail(to, 'Welcome to Spark!', html);
  }

  async sendOtpEmail(to, code, type = 'verification') {
    const title = type === 'password_reset' ? 'Password Reset Code' : 'Your Verification Code';
    const html = `
      <h2>${title}</h2>
      <p>Your 6-digit code is: <strong>${code}</strong></p>
      <p>This code expires in 10 minutes.</p>
    `;
    return this.sendMail(to, title, html);
  }

  async sendPasswordChangedEmail(to) {
    const html = `
      <h2>Security Alert: Password Changed</h2>
      <p>Your Spark password was recently changed. If you did not make this change, please contact support immediately.</p>
    `;
    return this.sendMail(to, 'Your Spark Password Was Changed', html);
  }

  async sendEmailVerifiedEvent(to) {
    const html = `
      <h2>Email Verified Successfully</h2>
      <p>Your email address has been successfully verified. You now have full access to your Spark account.</p>
    `;
    return this.sendMail(to, 'Email Verification Successful', html);
  }
}

export const emailService = new EmailService();
