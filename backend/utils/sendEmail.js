const nodemailer = require('nodemailer');

async function sendEmail({ to, subject, text, html }) {
  // safe no-op logger when email creds are not configured
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  // prefer explicit SMTP host if provided
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
  const secure = typeof process.env.SMTP_SECURE !== 'undefined' ? process.env.SMTP_SECURE === 'true' : undefined;

  if (!user || !pass) {
    console.warn('sendEmail: missing EMAIL_USER or EMAIL_PASS in env; skipping send');
    return { ok: false, info: 'missing-credentials' };
  }

  let transporter;
  if (host) {
    transporter = nodemailer.createTransport({
      host,
      port: port || 587,
      secure: typeof secure === 'boolean' ? secure : false,
      auth: { user, pass },
    });
  } else if (process.env.EMAIL_SERVICE) {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: { user, pass },
    });
  } else {
    // fallback to Gmail SMTP sensible defaults
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    });
  }

  const mailOptions = { from: user, to, subject, text, html };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('sendEmail: message sent', info && info.messageId ? info.messageId : info);
    return { ok: true, info };
  } catch (err) {
    console.error('sendEmail: error sending mail', err && err.message ? err.message : err);
    throw err;
  }
}

module.exports = sendEmail;
