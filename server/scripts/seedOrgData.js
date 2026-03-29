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

import "dotenv/config";

import mongoose from "mongoose";
import Category from "../src/models/Category.js";
import Revenue from "../src/models/Revenue.js";
import Expense from "../src/models/Expense.js";
import AuditLog from "../src/models/AuditLog.js";
import Organization from "../src/models/Organization.js";
import User from "../src/models/User.js";

const FORCE = process.env.SEED_FORCE === "true";
const DEMO_ORG_NAME = process.env.DEMO_ORG_NAME || "Trackex Demo";
const DEMO_ORG_SLUG = process.env.DEMO_ORG_SLUG || "trackex-demo";
const DEMO_OWNER_EMAIL = process.env.DEMO_OWNER_EMAIL || "owner@trackex.com";
const DEMO_OWNER_PASSWORD = process.env.DEMO_OWNER_PASSWORD || "owner123";
const DEMO_GUEST_EMAIL = process.env.GUEST_LOGIN_EMAIL || "guest@trackex.com";
const DEMO_GUEST_PASSWORD = process.env.DEMO_GUEST_PASSWORD || "guest123";
const DEMO_TEAM_PASSWORD = process.env.DEMO_TEAM_PASSWORD || "guest123";

const demoTeamUsers = [
  {
    name: "Maya Manager",
    email: "maya.manager@trackex.com",
    role: "manager",
  },
  {
    name: "Ravi Manager",
    email: "ravi.manager@trackex.com",
    role: "manager",
  },
  {
    name: "Asha Member",
    email: "asha.member@trackex.com",
    role: "member",
  },
  {
    name: "Noah Member",
    email: "noah.member@trackex.com",
    role: "member",
  },
  {
    name: "Emma Member",
    email: "emma.member@trackex.com",
    role: "member",
  },
];

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

const upsertDemoOrgUser = async ({
  name,
  email,
  password,
  role,
  organizationId,
}) => {
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    await User.create({
      name,
      email,
      password,
      role,
      organization: organizationId,
    });

    return "created";
  }

  if (String(existingUser.organization) !== String(organizationId)) {
    console.warn(
      `Skipped demo user ${email}: email already belongs to another organization.`,
    );
    return "skipped";
  }

  let shouldSave = false;
  if (existingUser.name !== name) {
    existingUser.name = name;
    shouldSave = true;
  }

  if (existingUser.role !== role) {
    existingUser.role = role;
    shouldSave = true;
  }

  if (shouldSave) {
    await existingUser.save();
    return "updated";
  }

  return "unchanged";
};

const ensureDemoTeamUsers = async (organizationId) => {
  const summary = {
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
  };

  for (const user of demoTeamUsers) {
    const status = await upsertDemoOrgUser({
      ...user,
      password: DEMO_TEAM_PASSWORD,
      organizationId,
    });

    summary[status] += 1;
  }

  console.log(
    `Demo users seeded (created: ${summary.created}, updated: ${summary.updated}, unchanged: ${summary.unchanged}, skipped: ${summary.skipped}).`,
  );
};

const getAuditSeedEntries = ({
  organizationId,
  ownerId,
  guestId,
  memberIds,
}) => {
  const [firstMemberId, secondMemberId] = memberIds;

  return [
    {
      organization: organizationId,
      actor: ownerId,
      action: "invite.sent",
      entity: "invite",
      entityId: new mongoose.Types.ObjectId().toString(),
      meta: {
        role: "member",
        email: "asha.member@trackex.com",
      },
      createdAt: daysAgo(26),
      updatedAt: daysAgo(26),
    },
    {
      organization: organizationId,
      actor: ownerId,
      action: "invite.accepted",
      entity: "invite",
      entityId: new mongoose.Types.ObjectId().toString(),
      meta: {
        acceptedBy: "asha.member@trackex.com",
        role: "member",
      },
      createdAt: daysAgo(25),
      updatedAt: daysAgo(25),
    },
    {
      organization: organizationId,
      actor: guestId,
      action: "transaction.created",
      entity: "expense",
      entityId: new mongoose.Types.ObjectId().toString(),
      meta: {
        amount: 555,
        category: "Internet",
        description: "Vianet",
      },
      createdAt: daysAgo(20),
      updatedAt: daysAgo(20),
    },
    {
      organization: organizationId,
      actor: guestId,
      action: "transaction.created",
      entity: "revenue",
      entityId: new mongoose.Types.ObjectId().toString(),
      meta: {
        amount: 34000,
        category: "Eye Care",
        description: "Drops",
      },
      createdAt: daysAgo(18),
      updatedAt: daysAgo(18),
    },
    {
      organization: organizationId,
      actor: ownerId,
      action: "user.role_changed",
      entity: "user",
      entityId: firstMemberId
        ? String(firstMemberId)
        : new mongoose.Types.ObjectId().toString(),
      meta: {
        fromRole: "member",
        toRole: "manager",
      },
      createdAt: daysAgo(12),
      updatedAt: daysAgo(12),
    },
    {
      organization: organizationId,
      actor: ownerId,
      action: "user.role_changed",
      entity: "user",
      entityId: firstMemberId
        ? String(firstMemberId)
        : new mongoose.Types.ObjectId().toString(),
      meta: {
        fromRole: "manager",
        toRole: "member",
      },
      createdAt: daysAgo(10),
      updatedAt: daysAgo(10),
    },
    {
      organization: organizationId,
      actor: guestId,
      action: "transaction.updated",
      entity: "revenue",
      entityId: new mongoose.Types.ObjectId().toString(),
      meta: {
        field: "amount",
        previousValue: 5000,
        nextValue: 5200,
      },
      createdAt: daysAgo(7),
      updatedAt: daysAgo(7),
    },
    {
      organization: organizationId,
      actor: guestId,
      action: "transaction.deleted",
      entity: "expense",
      entityId: new mongoose.Types.ObjectId().toString(),
      meta: {
        amount: 399,
        category: "Internet",
      },
      createdAt: daysAgo(5),
      updatedAt: daysAgo(5),
    },
    {
      organization: organizationId,
      actor: ownerId,
      action: "invite.revoked",
      entity: "invite",
      entityId: new mongoose.Types.ObjectId().toString(),
      meta: {
        email: "old.member@trackex.com",
      },
      createdAt: daysAgo(3),
      updatedAt: daysAgo(3),
    },
    {
      organization: organizationId,
      actor: guestId,
      action: "user.role_changed",
      entity: "user",
      entityId: secondMemberId
        ? String(secondMemberId)
        : new mongoose.Types.ObjectId().toString(),
      meta: {
        fromRole: "member",
        toRole: "manager",
      },
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
    },
  ];
};

const ensureDemoAuditLogs = async (organizationId) => {
  const existingLogCount = await AuditLog.countDocuments({
    organization: organizationId,
  });

  if (existingLogCount > 0 && !FORCE) {
    console.log("Audit log seed skipped: logs already exist for org.");
    return;
  }

  const users = await User.find({ organization: organizationId }).select(
    "_id email role",
  );

  const owner = users.find((user) => user.role === "owner");
  const guest = users.find((user) => user.email === DEMO_GUEST_EMAIL);
  const members = users.filter((user) => user.role === "member");

  if (!owner || !guest) {
    console.warn(
      "Audit log seed skipped: required demo owner/guest users were not found.",
    );
    return;
  }

  if (existingLogCount > 0 && FORCE) {
    await AuditLog.deleteMany({ organization: organizationId });
  }

  const entries = getAuditSeedEntries({
    organizationId,
    ownerId: owner._id,
    guestId: guest._id,
    memberIds: members.map((member) => member._id),
  });

  await AuditLog.insertMany(entries);
  console.log(`Audit logs seeded (${entries.length} entries).`);
};

const seed = async () => {
  if (!process.env.MONGO_URL) {
    throw new Error("Missing MONGO_URL env var.");
  }

  await mongoose.connect(process.env.MONGO_URL);

  const organization = await ensureDemoOrganization();
  await ensureDemoGuestManager(organization._id);
  await ensureDemoTeamUsers(organization._id);
  await ensureDemoAuditLogs(organization._id);

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
