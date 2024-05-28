import Expense from "../models/Expense.js";
import Revenue from "../models/Revenue.js";

async function aggregateMonthHistory(month, year) {
  try {
    // Aggregation logic for expenses
    const expenseResult = await Expense.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $month: "$date" }, month] }, // Filter by month
              { $eq: [{ $year: "$date" }, year] }, // Filter by year if needed
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: "$amount" },
        },
      },
    ]);

    // Aggregation logic for revenue
    const revenueResult = await Revenue.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $month: "$date" }, month] }, // Filter by month
              { $eq: [{ $year: "$date" }, year] }, // Filter by year if needed
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    // Combine results
    const monthHistory = {
      month: month,
      year: year,
      totalExpense:
        expenseResult.length > 0 ? expenseResult[0].totalExpense : 0,
      totalRevenue:
        revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0,
    };

    // Optionally, return aggregated data or a success message
    return monthHistory;
  } catch (error) {
    // Handle errors
    console.error("Error aggregating month history:", error);
    throw error;
  }
}

async function aggregateYearHistory(year) {
  try {
    // Aggregation logic for expenses
    const expenseResult = await Expense.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $year: "$date" }, year] }, // Filter by year
        },
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: "$amount" },
        },
      },
    ]);

    // Aggregation logic for revenue
    const revenueResult = await Revenue.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $year: "$date" }, year] }, // Filter by year
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    // Combine results
    const yearHistory = {
      year: year,
      totalExpense:
        expenseResult.length > 0 ? expenseResult[0].totalExpense : 0,
      totalRevenue:
        revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0,
    };

    // Optionally, return aggregated data or a success message
    return yearHistory;
  } catch (error) {
    // Handle errors
    console.error("Error aggregating year history:", error);
    throw error;
  }
}

export { aggregateMonthHistory, aggregateYearHistory };
