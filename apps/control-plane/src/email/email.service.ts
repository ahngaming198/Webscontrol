import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransporter({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    const mailOptions = {
      from: this.configService.get('SMTP_FROM'),
      to,
      subject,
      html,
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendWelcomeEmail(to: string, firstName: string) {
    const template = `
      <h1>Welcome to Hosting Control Panel!</h1>
      <p>Hello {{firstName}},</p>
      <p>Welcome to our hosting control panel. You can now manage your websites, databases, and more.</p>
      <p>Best regards,<br>The Hosting Control Panel Team</p>
    `;

    const compiledTemplate = handlebars.compile(template);
    const html = compiledTemplate({ firstName });

    return this.sendEmail(to, 'Welcome to Hosting Control Panel', html);
  }

  async sendPasswordResetEmail(to: string, resetToken: string) {
    const template = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="{{resetUrl}}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    const compiledTemplate = handlebars.compile(template);
    const resetUrl = `${this.configService.get('APP_URL')}/reset-password?token=${resetToken}`;
    const html = compiledTemplate({ resetUrl });

    return this.sendEmail(to, 'Password Reset Request', html);
  }
}
