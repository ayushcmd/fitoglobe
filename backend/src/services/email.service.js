const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST,
  port:   Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPasswordReset = async (email, name, resetUrl) => {
  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      email,
    subject: "FitoGlobe — Reset your password",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#07070E;color:#F2F2FF;padding:32px;border-radius:16px">
        <h1 style="color:#C8FF00;font-size:28px;margin-bottom:8px">FITOGLOBE</h1>
        <h2 style="font-size:20px;margin-bottom:16px">Reset Your Password</h2>
        <p style="color:#8888A8;margin-bottom:24px">Hey ${name}, click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#C8FF00;color:#000;padding:14px 28px;border-radius:10px;font-weight:700;text-decoration:none;margin-bottom:24px">Reset Password</a>
        <p style="color:#4A4A68;font-size:12px">If you didn't request this, ignore this email. Your password won't change.</p>
      </div>
    `,
  });
};

const sendWelcome = async (email, name) => {
  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      email,
    subject: "Welcome to FitoGlobe!",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#07070E;color:#F2F2FF;padding:32px;border-radius:16px">
        <h1 style="color:#C8FF00;font-size:28px;margin-bottom:8px">FITOGLOBE</h1>
        <h2 style="font-size:20px;margin-bottom:16px">Welcome, ${name}!</h2>
        <p style="color:#8888A8">Your fitness journey starts now. Track workouts, nutrition, and progress — all in one place.</p>
      </div>
    `,
  });
};

module.exports = { sendPasswordReset, sendWelcome };
