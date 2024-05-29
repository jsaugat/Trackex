import mongoose from "mongoose";
import Expense from "../models/Expense.js";
import asyncHandler from "express-async-handler";
import { updateMonthHistory } from "../middlewares/updateMonthHistory.js";

/**
 *  @desc    Get all expenses
 *  @route   GET /api/expenses/
 */
const getExpenses = asyncHandler(async (req, res, next) => {
  // const { _id: userId } = req.user;
  // Sort expenses from latest to oldest
  const expenses = await Expense.find({}).sort({ createdAt: -1 });
  res.status(200).json(expenses);
});

/**
 *  @desc    Add an expense
 *  @route   POST /api/expenses/
 */
const createExpense = asyncHandler(async (req, res, next) => {
  const { expensesEntries } = req.body;

  //? multiple expensesEntry (if array)
  if (Array.isArray(expensesEntries)) {
    const createdExpenses = await Expense.insertMany(
      expensesEntries.map((entry) => ({ ...entry, type: "expense" }))
    );
    res.status(201).json(createdExpenses);
    return;
  }
  //? single expenseEntry
  const createdExpense = await Expense.create({
    ...expensesEntries,
    type: "expense",
  });

  // Call the updateMonthHistory middleware to update MonthHistory
  // req.body.userId = savedExpense.userId; // Assuming userId is present in savedExpense
  // req.body.amount = savedExpense.amount; // Assuming amount is present in savedExpense
  // req.body.date = savedExpense.date; // Assuming date is present in savedExpense
  // await updateMonthHistory(req, res, next);
  res.status(201).json(createdExpense);
});

/**
 *  @desc    Update an expense
 *  @route   PATCH /api/expenses/:id
 */
const updateExpense = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid Mongoose ObjectId" });
  }
  const updatedExpense = await Expense.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true }
  );
  res.status(200).json(updatedExpense);
});

/**
 *  @desc    Delete an expense
 *  @route   DELETE /api/expenses/:id
 */
const deleteExpense = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deletedExpense = await Expense.findByIdAndDelete(id);
  res.status(200).json(deletedExpense);
});

export { createExpense, updateExpense, deleteExpense, getExpenses };
