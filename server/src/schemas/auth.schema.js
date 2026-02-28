// src/schemas/auth.schema.js
import { z } from "zod";

const email = z.string().trim().email("Invalid email.");

const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Z]/, "Password must include an uppercase letter.")
  .regex(/[a-z]/, "Password must include a lowercase letter.")
  .regex(/[0-9]/, "Password must include a number.")
  .regex(/[^A-Za-z0-9]/, "Password must include a symbol.");

const slug = z
  .string()
  .trim()
  .min(3, "Workspace URL must be at least 3 characters.")
  .max(50, "Workspace URL is too long.")
  .regex(
    /^[a-z0-9-]+$/,
    "Workspace URL can only contain lowercase letters, numbers, and hyphens.",
  )
  .transform((s) => s.toLowerCase());

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(80, "Name is too long."),
  email,
  password: strongPassword,

  // Either inviteToken OR orgName+orgSlug
  inviteToken: z.string().trim().optional(),

  orgName: z.string().trim().min(1).max(80).optional(),
  orgSlug: slug.optional(),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required."),
});

export const verifyLoginOtpSchema = z.object({
  email,
  otp: z.string().trim().regex(/^\d{6}$/, "OTP must be a 6-digit code."),
});

export const forgotPasswordSchema = z.object({
  // Keep payload minimal to avoid leaking account state through variable inputs.
  email,
});

export const resetPasswordSchema = z
  .object({
    // Reuse strong password policy from registration.
    password: strongPassword,
    // Collected explicitly so mismatch can be handled at validation layer.
    confirmPassword: z.string().min(1, "Confirm password is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
