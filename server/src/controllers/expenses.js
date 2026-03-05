import mongoose from "mongoose";
import Expense from "../models/Expense.js";
import asyncHandler from "express-async-handler";
import AppError from "../utils/appError.js";
import { logActivity } from "../utils/logActivity.js";

/**
 *  @desc    Get all expenses
 *  @route   GET /api/expenses/
 */
const getExpenses = asyncHandler(async (req, res, next) => {
  const organizationId = req.user?.organization;
  if (!organizationId) {
    throw new AppError("Unable to determine organization context", 400);
  }

  // Sort expenses for the authenticated organization from latest to oldest
  const expenses = await Expense.find({ organization: organizationId }).sort({
    createdAt: -1,
  });
  res.status(200).json(expenses);
});

/**
 *  @desc    Add an expense
 *  @route   POST /api/expenses/
 */
const createExpense = asyncHandler(async (req, res, next) => {
  const organizationId = req.user?.organization;
  if (!organizationId) {
    throw new AppError("Unable to determine organization context", 400);
  }

  const { expensesEntries } = req.body;
  const rawEntries = Array.isArray(expensesEntries)
    ? expensesEntries
    : [req.body];

  const normalizedEntries = rawEntries.map((entry) => ({
    ...entry,
    type: "expense",
    organization: organizationId,
  }));

  if (Array.isArray(expensesEntries)) {
    const createdExpenses = await Expense.insertMany(normalizedEntries);
    await Promise.all(
      createdExpenses.map((entry) =>
        logActivity({
          req,
          action: "transaction.created",
          entity: "expense",
          entityId: entry._id,
          meta: {
            amount: entry.amount,
            category: entry.category,
            type: entry.type,
          },
        }),
      ),
    );
    res.status(201).json(createdExpenses);
    return;
  }

  const createdExpense = await Expense.create(normalizedEntries[0]);
  await logActivity({
    req,
    action: "transaction.created",
    entity: "expense",
    entityId: createdExpense._id,
    meta: {
      amount: createdExpense.amount,
      category: createdExpense.category,
      type: createdExpense.type,
    },
  });
  res.status(201).json(createdExpense);
});

/**
 *  @desc    Update an expense
 *  @route   PATCH /api/expenses/:id
 */
const updateExpense = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const organizationId = req.user?.organization;
  if (!organizationId) {
    throw new AppError("Unable to determine organization context", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid expense identifier", 404);
  }

  const updatedExpense = await Expense.findOneAndUpdate(
    { _id: id, organization: organizationId },
    { ...req.body },
    { new: true }
  );

  if (!updatedExpense) {
    throw new AppError("Expense not found", 404);
  }

  await logActivity({
    req,
    action: "transaction.updated",
    entity: "expense",
    entityId: updatedExpense._id,
    meta: {
      changedFields: Object.keys(req.body || {}),
    },
  });

  res.status(200).json(updatedExpense);
});

/**
 *  @desc    Delete an expense
 *  @route   DELETE /api/expenses/:id
 */
const deleteExpense = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const organizationId = req.user?.organization;
  if (!organizationId) {
    throw new AppError("Unable to determine organization context", 400);
  }

  const deletedExpense = await Expense.findOneAndDelete({
    _id: id,
    organization: organizationId,
  });

  if (!deletedExpense) {
    throw new AppError("Expense not found", 404);
  }

  await logActivity({
    req,
    action: "transaction.deleted",
    entity: "expense",
    entityId: deletedExpense._id,
    meta: {
      amount: deletedExpense.amount,
      category: deletedExpense.category,
      type: deletedExpense.type,
    },
  });

  res.status(200).json(deletedExpense);
});

export { createExpense, updateExpense, deleteExpense, getExpenses };
