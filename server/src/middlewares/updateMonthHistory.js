import MonthHistory from "../models/MonthHistory.js";

// Middleware function to update MonthHistory
const updateMonthHistory = async (req, res, next) => {
  try {
    // Extract necessary data from the request
    const { userId, amount, date } = req.body;

    // Find or create the corresponding MonthHistory entry
    let monthHistory = await MonthHistory.findOneAndUpdate(
      {
        userId,
        date: { $gte: new Date(date.getFullYear(), date.getMonth(), 1) },
      }, // Find the corresponding MonthHistory entry
      {}, // Empty update
      { upsert: true, new: true } // Create a new entry if none exists, return the updated document
    );

    // Check if the request is for an expense or revenue
    if (req.url === "/api/expenses") {
      // Increment expensesAmount
      monthHistory.expensesAmount += amount;
    } else if (req.url === "/api/revenue") {
      // Increment revenueAmount
      monthHistory.revenueAmount += amount;
    }

    // Save the updated MonthHistory document
    await monthHistory.save();

    // Continue with the request
    next();
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "UpdateMonthHistory Error" });
  }
};

export { updateMonthHistory };
