// Import necessary modules and dependencies
import nodemailer from "nodemailer";
import { Resend } from "resend";

// Environment variables and default values
const EMAIL = process.env.EMAIL || "saugatjoshi.com.np";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "re_dummy_key";
const RESEND_FROM =
  process.env.RESEND_FROM_EMAIL || `Trackex <no-reply@${EMAIL}>`;

const SMTP_HOST = process.env.SMTP_HOST || process.env.HOST;
const SMTP_PORT = Number(
  process.env.SMTP_PORT || process.env.EMAIL_PORT || 587,
);
const SMTP_SECURE =
  String(process.env.SMTP_SECURE || process.env.SECURE || "false") === "true";
const SMTP_USER = process.env.SMTP_USER || process.env.USER;
const SMTP_PASS = process.env.SMTP_PASS || process.env.PASSWORD;
const SMTP_FROM = process.env.SMTP_FROM_EMAIL || `Trackex <no-reply@${EMAIL}>`;

// Feature flags for enabling Resend and SMTP
const resendEnabled =
  Boolean(RESEND_API_KEY) && !String(RESEND_API_KEY).startsWith("re_dummy");

const smtpEnabled = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

// Initialize Resend client if enabled
const resendClient = resendEnabled ? new Resend(RESEND_API_KEY) : null;

// Initialize SMTP transporter if enabled
const smtpTransporter = smtpEnabled
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })
  : null;

/**
 * Sends an email using Resend as the primary provider and SMTP as a fallback.
 *
 * @param {Object} params - Email parameters.
 * @param {string|string[]} params.to - Recipient(s) of the email.
 * @param {string} params.subject - Subject of the email.
 * @param {string} params.html - HTML content of the email.
 * @param {string} [params.text] - Plain text content of the email.
 * @param {string} [params.idempotencyKey] - Idempotency key for Resend.
 * @param {Object} [params.tags] - Tags for Resend.
 * @returns {Promise<Object>} - Result of the email delivery attempt.
 *   - {boolean} ok - Whether the email was sent successfully.
 *   - {string} provider - The provider used ("resend", "smtp", or "none").
 *   - {string|null} id - The ID of the email sent, if available.
 */
export const sendEmail = async ({
  to,
  subject,
  html,
  text,
  idempotencyKey,
  tags,
}) => {
  const recipients = Array.isArray(to) ? to : [to];

  // Attempt to send email using Resend
  if (resendClient) {
    try {
      const { data, error } = await resendClient.emails.send({
        from: RESEND_FROM,
        to: recipients,
        subject,
        html,
        text,
        idempotencyKey,
        tags,
      });

      if (!error) {
        return { ok: true, provider: "resend", id: data?.id || null };
      }

      console.warn("[EMAIL_RESEND_ERROR]", error?.message || error);
    } catch (error) {
      console.warn("[EMAIL_RESEND_NETWORK_ERROR]", error?.message || error);
    }
  }

  // Fallback to SMTP if Resend fails
  if (smtpTransporter) {
    try {
      const info = await smtpTransporter.sendMail({
        from: SMTP_FROM,
        to: recipients.join(","),
        subject,
        html,
        text,
      });
      return { ok: true, provider: "smtp", id: info.messageId || null };
    } catch (error) {
      console.warn("[EMAIL_SMTP_ERROR]", error?.message || error);
    }
  }

  // Log failure if both Resend and SMTP fail
  console.warn(
    `[EMAIL_FALLBACK_LOG] to=${recipients.join(",")} subject="${subject}"`,
  );
  return { ok: false, provider: "none", id: null };
};
