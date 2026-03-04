import crypto from "crypto";

export const hashToken = (otp) => {
  return crypto.createHash("sha256").update(String(otp)).digest("hex");
};
