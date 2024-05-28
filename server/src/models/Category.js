import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    // userId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    name: {
      type: String,
      required: true,
      unique: false,
    },
    icon: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["revenue", "expense"],
      required: true,
    },
  },
  { timestamps: true }
);

// Create Product Category Model
const Category = mongoose.model("Category", categorySchema);

export default Category;
