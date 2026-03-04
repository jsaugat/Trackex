import { z } from "zod";

const orgName = z
  .string()
  .trim()
  .min(1, "Organization name is required.")
  .max(80, "Organization name is too long.");

const orgSlug = z
  .string()
  .trim()
  .min(3, "Workspace URL must be at least 3 characters.")
  .max(50, "Workspace URL is too long.")
  .regex(
    /^[a-z0-9-]+$/,
    "Workspace URL can only contain lowercase letters, numbers, and hyphens.",
  )
  .transform((s) => s.toLowerCase());

export const updateOrganizationSchema = z
  .object({
    name: orgName.optional(),
    slug: orgSlug.optional(),
  })
  .refine((data) => Boolean(data.name || data.slug), {
    message: "Provide at least one field: name or slug.",
    path: [],
  });
