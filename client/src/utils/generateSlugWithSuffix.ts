import { nanoid } from "nanoid";

export function generateSlugWithSuffix(
  value: string,
  suffixLength: number = 6, // 6 chars
) {
  const baseSlug = value
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
  const suffix = nanoid(suffixLength).toLowerCase();
  return `${baseSlug}-${suffix}`;
}
