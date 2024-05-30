import mongoose from "mongoose";
import { Schema } from "mongoose";

const yearHistorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    expensesAmount: {
      type: Number,
      required: true,
    },
    revenueAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Create virtual properties for day, month, and year
yearHistorySchema.virtual("month", {
  get() {
    return this.date.getMonth() + 1; // Months are 0-indexed, so add 1
  },
});

yearHistorySchema.virtual("year", {
  get() {
    return this.date.getFullYear();
  },
});

const YearHistory = mongoose.model("YearHistory", yearHistorySchema);

export default YearHistory;
