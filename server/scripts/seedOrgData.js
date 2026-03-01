/**
 * Seed Syjo Corp. test data.
 *
 * Usage:
 *   1) Ensure `MONGO_URL` is set in your environment.
 *   2) From the `server` directory run:
 *      node scripts/seedOrgData.js
 *
 * Optional:
 *   - Set `SEED_FORCE=true` to delete existing org data before seeding.
 */

import mongoose from "mongoose";
import Category from "../src/models/Category.js";
import Revenue from "../src/models/Revenue.js";
import Expense from "../src/models/Expense.js";

const ORG_ID = "69a342415040fb48d4aa49dc"; // Syjo Corp.
const FORCE = process.env.SEED_FORCE === "true";

const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const revenueCategories = [
  { name: "Eye Care", icon: "EYE", type: "revenue" },
  { name: "Beauty Tools", icon: "BEAUTY", type: "revenue" },
  { name: "Skin Care", icon: "SKIN", type: "revenue" },
];

const expenseCategories = [
  { name: "Internet", icon: "NET", type: "expense" },
  { name: "Training & Development", icon: "TRAIN", type: "expense" },
  { name: "Charity", icon: "CHARITY", type: "expense" },
];

const revenueEntries = [
  {
    type: "revenue",
    description: "Drops",
    amount: 34000,
    quantity: 22,
    category: "Eye Care",
    customer: "Jane Doe",
    date: daysAgo(2),
  },
  {
    type: "revenue",
    description: "Mascara",
    amount: 122,
    quantity: 5,
    category: "Beauty Tools",
    customer: "Jane Doe",
    date: daysAgo(2),
  },
  {
    type: "revenue",
    description: "Moisturizer",
    amount: 5200,
    quantity: 8,
    category: "Skin Care",
    customer: "Riya Shrestha",
    date: daysAgo(7),
  },
];

const expenseEntries = [
  {
    type: "expense",
    description: "Vianet",
    amount: 555,
    quantity: 1,
    category: "Internet",
    entity: "Vianet",
    date: daysAgo(10),
  },
  {
    type: "expense",
    description: "Suman Marketing Training",
    amount: 12399,
    quantity: 1,
    category: "Training & Development",
    entity: "Suman Marketing",
    date: daysAgo(14),
  },
  {
    type: "expense",
    description: "Cancer",
    amount: 10000,
    quantity: 1,
    category: "Charity",
    entity: "Cancer Foundation",
    date: daysAgo(20),
  },
];

const withOrg = (entry) => ({
  ...entry,
  organization: ORG_ID,
});

const seed = async () => {
  if (!process.env.MONGO_URL) {
    throw new Error("Missing MONGO_URL env var.");
  }

  await mongoose.connect(process.env.MONGO_URL);

  const existingCategoryCount = await Category.countDocuments({
    organization: ORG_ID,
  });
  const existingRevenueCount = await Revenue.countDocuments({
    organization: ORG_ID,
  });
  const existingExpenseCount = await Expense.countDocuments({
    organization: ORG_ID,
  });

  const hasExistingData =
    existingCategoryCount > 0 ||
    existingRevenueCount > 0 ||
    existingExpenseCount > 0;

  if (hasExistingData && !FORCE) {
    console.log(
      "Seed skipped: data already exists for org. Set SEED_FORCE=true to overwrite.",
    );
    await mongoose.disconnect();
    return;
  }

  if (FORCE) {
    await Promise.all([
      Category.deleteMany({ organization: ORG_ID }),
      Revenue.deleteMany({ organization: ORG_ID }),
      Expense.deleteMany({ organization: ORG_ID }),
    ]);
  }

  await Category.insertMany(
    [...revenueCategories, ...expenseCategories].map(withOrg),
  );
  await Revenue.insertMany(revenueEntries.map(withOrg));
  await Expense.insertMany(expenseEntries.map(withOrg));

  console.log("Seed complete for Syjo Corp.");
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error("Seed failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
