import mongoose from "mongoose";
import dotenv from "dotenv";
import Organization from "../models/Organization.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, "../../.env");
console.log("Loading .env from:", envPath);
dotenv.config({ path: envPath });

console.log("MONGO_URL exists:", !!process.env.MONGO_URL);

const verifyOrganizationModel = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is undefined");
    }
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB via verification script");

    const testOrg = new Organization({
      name: "Test Organization",
      slug: "test-org-" + Date.now(),
    });

    const savedOrg = await testOrg.save();
    console.log("Organization created successfully:", savedOrg);

    await Organization.findByIdAndDelete(savedOrg._id);
    console.log("Test Organization deleted.");
  } catch (error) {
    console.error("Error verifying Organization model:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

verifyOrganizationModel();
