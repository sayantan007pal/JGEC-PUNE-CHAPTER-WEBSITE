import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/KTSiaiNkuEX9ytj1KLPLcY";

function emailWrapper(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #1a365d 0%, #2d5a87 50%, #c9a84c 100%); padding: 32px 24px; text-align: center; }
        .header h1 { color: #ffffff; font-size: 24px; margin: 0; font-weight: 700; }
        .header p { color: rgba(255,255,255,0.85); font-size: 14px; margin: 8px 0 0; }
        .body { padding: 32px 24px; color: #333333; line-height: 1.6; }
        .body h2 { color: #1a365d; font-size: 20px; margin: 0 0 16px; }
        .body p { margin: 0 0 16px; font-size: 15px; }
        .otp-box { background: #f0f4ff; border: 2px dashed #2d5a87; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0; }
        .otp-code { font-size: 36px; font-weight: 800; color: #1a365d; letter-spacing: 8px; font-family: monospace; }
        .btn { display: inline-block; background: linear-gradient(135deg, #c9a84c, #d4b85c); color: #1a365d; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px; margin: 16px 0; }
        .btn:hover { opacity: 0.9; }
        .footer { background: #f8f9fa; padding: 24px; text-align: center; border-top: 1px solid #e9ecef; }
        .footer p { color: #6c757d; font-size: 12px; margin: 4px 0; }
        .divider { border: none; border-top: 1px solid #e9ecef; margin: 24px 0; }
        .highlight { background: #fff8e1; border-left: 4px solid #c9a84c; padding: 12px 16px; border-radius: 4px; margin: 16px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>JGEC Alumni Association</h1>
          <p>Pune Chapter</p>
        </div>
        ${content}
        <div class="footer">
          <p>JGEC Alumni Association, Pune Chapter</p>
          <p>Jalpaiguri Government Engineering College</p>
          <p>&copy; ${new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendVerificationEmail(
  email: string,
  otp: string
): Promise<void> {
  const html = emailWrapper(`
    <div class="body">
      <h2>Verify Your Email Address</h2>
      <p>Welcome to the JGEC Alumni Association, Pune Chapter! Please use the verification code below to complete your registration:</p>
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
      </div>
      <div class="highlight">
        <p style="margin:0;"><strong>⏰ This code expires in 10 minutes.</strong></p>
      </div>
      <p>If you did not create an account, please ignore this email.</p>
    </div>
  `);

  await transporter.sendMail({
    from: `"JGEC Alumni Pune" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email - JGEC Alumni Pune",
    html,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
): Promise<void> {
  const html = emailWrapper(`
    <div class="body">
      <h2>Reset Your Password</h2>
      <p>We received a request to reset the password for your JGEC Alumni Pune account. Click the button below to set a new password:</p>
      <div style="text-align: center;">
        <a href="${resetUrl}" class="btn">Reset Password</a>
      </div>
      <div class="highlight">
        <p style="margin:0;"><strong>⏰ This link expires in 1 hour.</strong></p>
      </div>
      <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
      <hr class="divider">
      <p style="font-size: 13px; color: #6c757d;">If the button doesn't work, copy and paste this link into your browser:<br><a href="${resetUrl}" style="color: #2d5a87; word-break: break-all;">${resetUrl}</a></p>
    </div>
  `);

  await transporter.sendMail({
    from: `"JGEC Alumni Pune" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password - JGEC Alumni Pune",
    html,
  });
}

export async function sendWelcomeEmail(
  email: string,
  fullName: string
): Promise<void> {
  const html = emailWrapper(`
    <div class="body">
      <h2>Welcome to the Family, ${fullName}! 🎉</h2>
      <p>Congratulations! Your email has been verified and your JGEC Alumni Pune account is now active.</p>
      <p>We're thrilled to have you as part of our growing community of JGEC alumni in Pune. Together, we're building bridges, creating opportunities, and celebrating our shared legacy.</p>
      <hr class="divider">
      <h2>Join Our WhatsApp Group 💬</h2>
      <p>Stay connected with fellow alumni! Join our official WhatsApp group to get the latest updates on events, meetups, and opportunities:</p>
      <div style="text-align: center;">
        <a href="${WHATSAPP_GROUP_LINK}" class="btn">Join WhatsApp Group</a>
      </div>
      <hr class="divider">
      <h2>What's Next?</h2>
      <ul style="padding-left: 20px;">
        <li>Log in with your email and password at our website</li>
        <li>Connect with fellow alumni at our upcoming events</li>
        <li>Share your expertise and mentorship with the community</li>
        <li>Stay updated through our WhatsApp group</li>
      </ul>
      <div class="highlight">
        <p style="margin:0;">Have questions? Reply to this email or reach out through our website's contact page.</p>
      </div>
    </div>
  `);

  await transporter.sendMail({
    from: `"JGEC Alumni Pune" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to JGEC Alumni Pune! 🎓",
    html,
  });
}
