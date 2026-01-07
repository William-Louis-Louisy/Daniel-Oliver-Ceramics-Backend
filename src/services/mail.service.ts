import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

let cachedTransporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null =
  null;
const getTransporter =
  (): nodemailer.Transporter<SMTPTransport.SentMessageInfo> => {
    if (cachedTransporter) return cachedTransporter;

    const { EMAIL_USER, EMAIL_PASSWORD } = process.env;
    if (!EMAIL_USER || !EMAIL_PASSWORD) {
      // Fail fast if credentials are missing
      throw new Error(
        "Missing EMAIL_USER or EMAIL_PASSWORD environment variables"
      );
    }

    cachedTransporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    } as SMTPTransport.Options);

    return cachedTransporter;
  };

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Send a contact email to the admin inbox.
 * @param email - email address provided by the visitor (used as replyTo)
 * @param subject - subject line
 * @param message - message content (plaintext)
 */

export async function sendContactEmail(
  email: string,
  firstName: string,
  lastName: string,
  subject: string,
  message: string
): Promise<SMTPTransport.SentMessageInfo> {
  const transporter = getTransporter();
  const adminEmail = process.env.EMAIL_USER as string;
  const now = new Date().toLocaleString("en-US", { timeZone: "UTC" });

  const textContent = [
    `New contact message`,
    `Time: ${now}`,
    `From: ${email}`,
    `Subject: ${subject}`,
    ``,
    message,
  ].join("\n");

  const htmlContent = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji; line-height:1.6;">
      <h2 style="margin:0 0 8px;">New contact message</h2>
      <p style="margin:0;"><strong>Time:</strong> ${escapeHtml(now)}</p>
      <p style="margin:0;"><strong>From:</strong> ${escapeHtml(email)}</p>
      <p style="margin:0;"><strong>Name:</strong> ${escapeHtml(
        firstName
      )} ${escapeHtml(lastName)}</p>
      <p style="margin:0 0 16px;"><strong>Subject:</strong> ${escapeHtml(
        subject
      )}</p>
      <pre style="white-space:pre-wrap; background:#f6f8fa; padding:12px; border-radius:8px; margin:0;">${escapeHtml(
        message
      )}</pre>
    </div>
  `;
  const mailOptions: Mail.Options = {
    from: adminEmail, // use authenticated sender for DMARC/SPF compliance
    to: adminEmail,
    subject,
    text: textContent,
    html: htmlContent,
    replyTo: email, // allow quick reply to the visitor
  };

  return transporter.sendMail(mailOptions);
}
