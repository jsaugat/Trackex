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
import Organization from "../src/models/Organization.js";
import User from "../src/models/User.js";

const FORCE = process.env.SEED_FORCE === "true";
const DEMO_ORG_NAME = process.env.DEMO_ORG_NAME || "Trackex Demo";
const DEMO_ORG_SLUG = process.env.DEMO_ORG_SLUG || "trackex-demo";
const DEMO_OWNER_EMAIL = process.env.DEMO_OWNER_EMAIL || "owner@trackex.com";
const DEMO_OWNER_PASSWORD = process.env.DEMO_OWNER_PASSWORD || "owner123";
const DEMO_GUEST_EMAIL = process.env.GUEST_LOGIN_EMAIL || "guest@trackex.com";
const DEMO_GUEST_PASSWORD = process.env.DEMO_GUEST_PASSWORD || "guest123";

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

const withOrg = (entry, orgId) => ({
  ...entry,
  organization: orgId,
});

const ensureDemoOrganization = async () => {
  let organization = await Organization.findOne({ slug: DEMO_ORG_SLUG });

  if (organization) {
    return organization;
  }

  const ownerId = new mongoose.Types.ObjectId();
  const orgId = new mongoose.Types.ObjectId();

  organization = await Organization.create({
    _id: orgId,
    name: DEMO_ORG_NAME,
    slug: DEMO_ORG_SLUG,
    owner: ownerId,
  });

  await User.create({
    _id: ownerId,
    name: "Demo Owner",
    email: DEMO_OWNER_EMAIL,
    password: DEMO_OWNER_PASSWORD,
    role: "owner",
    organization: organization._id,
  });

  return organization;
};

const ensureDemoGuestManager = async (organizationId) => {
  const existingGuest = await User.findOne({ email: DEMO_GUEST_EMAIL });

  if (!existingGuest) {
    await User.create({
      name: "Demo Guest",
      email: DEMO_GUEST_EMAIL,
      password: DEMO_GUEST_PASSWORD,
      role: "manager",
      organization: organizationId,
    });

    return;
  }

  let shouldSave = false;
  if (existingGuest.role !== "manager") {
    existingGuest.role = "manager";
    shouldSave = true;
  }

  if (String(existingGuest.organization) !== String(organizationId)) {
    existingGuest.organization = organizationId;
    shouldSave = true;
  }

  if (shouldSave) {
    await existingGuest.save();
  }
};

const seed = async () => {
  if (!process.env.MONGO_URL) {
    throw new Error("Missing MONGO_URL env var.");
  }

  await mongoose.connect(process.env.MONGO_URL);

  const organization = await ensureDemoOrganization();
  await ensureDemoGuestManager(organization._id);

  const existingCategoryCount = await Category.countDocuments({
    organization: organization._id,
  });
  const existingRevenueCount = await Revenue.countDocuments({
    organization: organization._id,
  });
  const existingExpenseCount = await Expense.countDocuments({
    organization: organization._id,
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
      Category.deleteMany({ organization: organization._id }),
      Revenue.deleteMany({ organization: organization._id }),
      Expense.deleteMany({ organization: organization._id }),
    ]);
  }

  await Category.insertMany(
    [...revenueCategories, ...expenseCategories].map((entry) =>
      withOrg(entry, organization._id),
    ),
  );
  await Revenue.insertMany(
    revenueEntries.map((entry) => withOrg(entry, organization._id)),
  );
  await Expense.insertMany(
    expenseEntries.map((entry) => withOrg(entry, organization._id)),
  );

  console.log("Seed complete for demo org.");
  console.log(`Demo org slug: ${organization.slug}`);
  console.log(`Guest login email: ${DEMO_GUEST_EMAIL}`);
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error("Seed failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
