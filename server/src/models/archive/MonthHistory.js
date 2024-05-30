import mongoose from "mongoose";
import { Schema } from "mongoose";

const monthHistorySchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  revenueAmount: {
    type: Number,
    required: true,
    min: 0, // Enforce non-negative income
  },
  expensesAmount: {
    type: Number,
    required: true,
    min: 0, // Enforce non-negative expense
  },
});

// Create a virtual property for day, month, and year for easier access
monthHistorySchema.virtual("day", {
  get() {
    return this.date.getDate();
  },
});

monthHistorySchema.virtual("month", {
  get() {
    return this.date.getMonth() + 1; // Months are 0-indexed, so add 1
  },
});

monthHistorySchema.virtual("year", {
  get() {
    return this.date.getFullYear();
  },
});

// Set a compound index for efficient querying based on userId, date
monthHistorySchema.index({ userId: 1, date: 1 }, { unique: true });

const MonthHistory = mongoose.model("MonthHistory", monthHistorySchema);

export default MonthHistory;
