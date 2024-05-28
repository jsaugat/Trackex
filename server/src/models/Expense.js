import mongoose from "mongoose";
import { Schema } from "mongoose";

const expenseSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["expense", "revenue"],
    },
    // userId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    entity: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
