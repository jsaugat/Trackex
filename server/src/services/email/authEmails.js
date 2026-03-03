/**
 * authEmails.js
 *
 * Centralized transactional email helpers for Trackex.
 *
 * What this module does:
 * - Builds consistent HTML + plain-text bodies for auth/security emails (OTP, password reset, password changed).
 * - Wraps `sendEmail()` with standardized subjects, tags, and an idempotency key to reduce duplicate sends.
 *
 * Notes / assumptions:
 * - `sendEmail()` is responsible for provider delivery, retries, and honoring the `idempotencyKey`.
 * - Email content is intentionally minimal and security-focused (no sensitive user data beyond OTP/reset URL).
 * - Consider replacing Date.now()-based idempotency with a deterministic key (e.g., requestId / userId + purpose)
 *   if you need true de-dupe across retries and server restarts.
 */
import { sendEmail } from "./emailClient.js";

const appName = process.env.APP_NAME || "Trackex";
const makeIdempotencyKey = (eventName, entity) =>
  `${eventName}/${entity}/${Date.now()}`;

const otpEmailHtml = ({ title, otp, note }) => `
  <div style="font-family:Arial,sans-serif;color:#111;line-height:1.5">
    <h2 style="margin:0 0 12px">${title}</h2>
    <p style="margin:0 0 12px">Use the one-time code below:</p>
    <p style="font-size:28px;font-weight:700;letter-spacing:4px;margin:0 0 12px">${otp}</p>
    <p style="margin:0 0 8px">${note}</p>
    <p style="margin:0;color:#555">If you did not request this, you can safely ignore this message.</p>
  </div>
`;

export const sendLoginOtpEmail = async ({ to, otp }) => {
  return sendEmail({
    to,
    subject: `${appName} login verification code`,
    html: otpEmailHtml({
      title: "Verify your login",
      otp,
      note: "This code expires in 10 minutes.",
    }),
    text: `Verify your login with this code: ${otp}. This code expires in 10 minutes.`,
    idempotencyKey: makeIdempotencyKey("login-otp", to),
    tags: [{ name: "event", value: "login_otp" }],
  });
};

export const sendRegisterOtpEmail = async ({ to, otp }) => {
  return sendEmail({
    to,
    subject: `${appName} registration verification code`,
    html: otpEmailHtml({
      title: "Complete your sign up",
      otp,
      note: "This code expires in 10 minutes.",
    }),
    text: `Complete your sign up with this code: ${otp}. This code expires in 10 minutes.`,
    idempotencyKey: makeIdempotencyKey("register-otp", to),
    tags: [{ name: "event", value: "register_otp" }],
  });
};

export const sendPasswordResetEmail = async ({ to, resetUrl }) => {
  return sendEmail({
    to,
    subject: `${appName} password reset link`,
    html: `
      <div style="font-family:Arial,sans-serif;color:#111;line-height:1.5">
        <h2 style="margin:0 0 12px">Reset your password</h2>
        <p style="margin:0 0 12px">Click the link below to set a new password.</p>
        <p style="margin:0 0 12px"><a href="${resetUrl}">${resetUrl}</a></p>
        <p style="margin:0;color:#555">This link expires in 15 minutes.</p>
      </div>
    `,
    text: `Reset your password using this link: ${resetUrl}. This link expires in 15 minutes.`,
    idempotencyKey: makeIdempotencyKey("password-reset", to),
    tags: [{ name: "event", value: "password_reset" }],
  });
};

export const sendPasswordChangedEmail = async ({ to }) => {
  return sendEmail({
    to,
    subject: `${appName} password changed`,
    html: `
      <div style="font-family:Arial,sans-serif;color:#111;line-height:1.5">
        <h2 style="margin:0 0 12px">Password updated</h2>
        <p style="margin:0 0 8px">Your password has been changed successfully.</p>
        <p style="margin:0;color:#555">If you did not perform this change, contact support immediately.</p>
      </div>
    `,
    text: `Your password has been changed successfully. If this was not you, contact support immediately.`,
    idempotencyKey: makeIdempotencyKey("password-changed", to),
    tags: [{ name: "event", value: "password_changed" }],
  });
};
