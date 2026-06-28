

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;


const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;


const SENDER = process.env.MAIL_FROM || "LearnoBoy <onboarding@resend.dev>";


function getEmailTemplate(title: string, greeting: string, bodyHtml: string, ctaLink: string, ctaText: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #f8fafc;
      color: #1e293b;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 20px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #0f172a, #1e293b);
      padding: 32px;
      text-align: center;
    }
    .logo {
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.5px;
      text-decoration: none;
    }
    .content {
      padding: 40px 32px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .text {
      font-size: 15px;
      line-height: 1.6;
      color: #475569;
      margin-bottom: 28px;
    }
    .cta-container {
      text-align: center;
      margin-bottom: 28px;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #2563eb, #4f46e5);
      color: #ffffff !important;
      text-decoration: none;
      font-size: 15px;
      font-weight: 600;
      padding: 12px 32px;
      border-radius: 10px;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
    }
    .footer {
      background-color: #f1f5f9;
      padding: 24px 32px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer-text {
      font-size: 12px;
      color: #64748b;
      line-height: 1.5;
      margin: 0;
    }
    .fallback-link {
      word-break: break-all;
      color: #2563eb;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}" class="logo">📚 LearnoBoy</a>
      </div>
      <div class="content">
        <h1 class="greeting">${greeting}</h1>
        <div class="text">${bodyHtml}</div>
        <div class="cta-container">
          <a href="${ctaLink}" class="cta-button" target="_blank">${ctaText}</a>
        </div>
        <p class="text" style="font-size: 12px; color: #94a3b8; margin-bottom: 0;">
          If the button above does not work, copy and paste this URL into your browser: <br>
          <a href="${ctaLink}" class="fallback-link">${ctaLink}</a>
        </p>
      </div>
      <div class="footer">
        <p class="footer-text">
          &copy; ${new Date().getFullYear()} LearnoBoy. All rights reserved. <br>
          Premium educational platform for developers and students.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}


export async function sendVerificationEmail(email: string, name: string, token: string): Promise<boolean> {
  const verifyLink = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/verify?token=${token}`;
  
  const title = "Verify your LearnoBoy account";
  const greeting = `Welcome to LearnoBoy, ${name}!`;
  const bodyHtml = `
    Thank you for registering! We're excited to have you join our community. <br><br>
    To finalize your account setup and start exploring premium courses, developer articles, and interactive coding tools, please verify your email address by clicking the link below:
  `;
  const ctaText = "Verify Account";
  
  const html = getEmailTemplate(title, greeting, bodyHtml, verifyLink, ctaText);
  const text = `Welcome to LearnoBoy, ${name}!\n\nPlease verify your email by opening the following link in your browser:\n${verifyLink}`;

  if (!resend) {
    console.log("\n================ MOCK EMAIL SENT (DEVELOPMENT) ================");
    console.log(`To: ${email}`);
    console.log(`Subject: ${title}`);
    console.log(`Verification URL: ${verifyLink}`);
    console.log("===============================================================\n");
    return true;
  }

  try {
    const { error } = await resend.emails.send({
      from: SENDER,
      to: email,
      subject: title,
      html,
      text,
    });

    if (error) {
      console.error("[mail] Resend verification email failed:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[mail] Unexpected verification email error:", err);
    return false;
  }
}


export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/reset-password?token=${token}`;
  
  const title = "Reset your LearnoBoy password";
  const greeting = "Forgot your password?";
  const bodyHtml = `
    We received a request to reset the password associated with your account. <br><br>
    If you did not make this request, you can safely ignore this email — your password will remain unchanged. <br><br>
    To choose a new password, click the recovery link below:
  `;
  const ctaText = "Reset Password";
  
  const html = getEmailTemplate(title, greeting, bodyHtml, resetLink, ctaText);
  const text = `Hello!\n\nPlease reset your password by opening the following link in your browser:\n${resetLink}\n\nThis link will expire in 1 hour.`;

  if (!resend) {
    console.log("\n================ MOCK EMAIL SENT (DEVELOPMENT) ================");
    console.log(`To: ${email}`);
    console.log(`Subject: ${title}`);
    console.log(`Password Reset URL: ${resetLink}`);
    console.log("===============================================================\n");
    return true;
  }

  try {
    const { error } = await resend.emails.send({
      from: SENDER,
      to: email,
      subject: title,
      html,
      text,
    });

    if (error) {
      console.error("[mail] Resend password reset email failed:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[mail] Unexpected password reset email error:", err);
    return false;
  }
}
