import mongoose from "mongoose";

// Import Expense and Revenue models
import Expense from "../models/Expense";
import Revenue from "../models/Revenue";

// Aggregate to get monthHistory
const getMonthHistory = async () => {
  try {
    const monthHistory = await Expense.aggregate([
      {
        $group: {
          _id: {
            userId: "$userId",
            day: { $dayOfMonth: "$date" },
            month: { $month: "$date" },
            year: { $year: "$date" },
          },
          expenseAmount: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "revenues",
          let: { userId: "$_id.userId", day: "$_id.day", month: "$_id.month", year: "$_id.year" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$userId"] },
                    { $eq: [{ $dayOfMonth: "$date" }, "$$day"] },
                    { $eq: [{ $month: "$date" }, "$$month"] },
                    { $eq: [{ $year: "$date" }, "$$year"] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                revenueAmount: { $sum: "$amount" },
              },
            },
          ],
          as: "revenue",
        },
      },
      {
        $addFields: {
          revenueAmount: { $ifNull: [{ $arrayElemAt: ["$revenue.revenueAmount", 0] }, 0] },
        },
      },
    ]);
    return monthHistory;
  } catch (error) {
    console.error("Error fetching monthHistory:", error);
    throw error;
  }
};

// Aggregate to get yearHistory
const getYearHistory = async () => {
  try {
    const yearHistory = await Expense.aggregate([
      {
        $group: {
          _id: {
            userId: "$userId",
            month: { $month: "$date" },
            year: { $year: "$date" },
          },
          expenseAmount: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "revenues",
          let: { userId: "$_id.userId", month: "$_id.month", year: "$_id.year" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$userId"] },
                    { $eq: [{ $month: "$date" }, "$$month"] },
                    { $eq: [{ $year: "$date" }, "$$year"] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                revenueAmount: { $sum: "$amount" },
              },
            },
          ],
          as: "revenue",
        },
      },
      {
        $addFields: {
          revenueAmount: { $ifNull: [{ $arrayElemAt: ["$revenue.revenueAmount", 0] }, 0] },
        },
      },
    ]);
    return yearHistory;
  } catch (error) {
    console.error("Error fetching yearHistory:", error);
    throw error;
  }
};

export { getMonthHistory, getYearHistory };
