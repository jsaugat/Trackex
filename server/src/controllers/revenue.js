import mongoose from "mongoose";
import Revenue from "../models/Revenue.js";
import asyncHandler from "express-async-handler";

/**
 *  @desc    Add a revenue transaction
 *  @route   POST /api/revenue/
 */
const createRevenue = asyncHandler(async (req, res, next) => {
  const { revenueEntries } = req.body;
  console.log("Revenue controller req.body: ", req.body);
  console.log("Revenue controller req.body.revenueEntries: ", revenueEntries);

  if (!Array.isArray(revenueEntries)) {
    //? If revenueEntries is not an array, treat it as a single entry
    const createdRevenue = await Revenue.create({
      ...req.body,
      type: "revenue",
    });
    console.log("Created single revenue entry:", createdRevenue);
    return res.status(201).json(createdRevenue);
  }

  //? If revenueEntries is an array, treat it as multiple revenueEntries
  const createdAllRevenue = await Revenue.insertMany(
    revenueEntries.map((entry) => ({ ...entry, type: "revenue" }))
  );
  console.log("Created multiple revenue revenueEntries:", createdAllRevenue);
  res.status(201).json(createdAllRevenue);
});

/**
 *  @desc    Get all revenue transactions
 *  @route   GET /api/revenue/
 */
const getRevenue = asyncHandler(async (req, res, next) => {
  // const { _id: userId } = req.user;
  // const { date } = req.body;
  // console.log("req.user >> userId :: ", userId);
  // Sort revenue transactions from latest to oldest
  const revenue = await Revenue.find({}).sort({ createdAt: -1 });
  res.status(200).json(revenue);
  // console.log(revenue);
});

/**
 *  @desc    Update a revenue transaction
 *  @route   PATCH /api/revenue/:id
 */
const updateRevenue = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid Mongoose ObjectId" });
  }
  const updatedRevenue = await Revenue.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(200).json(updatedRevenue);
});

/**
 *  @desc    Delete a revenue transaction
 *  @route   DELETE /api/revenue/:id
 */
const deleteRevenue = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid Mongoose ObjectId" });
  }

  const deletedRevenue = await Revenue.findByIdAndDelete(id);

  // Respond with 204 (No Content) if deletedRevenue is null (not found)
  if (!deletedRevenue) {
    return res.status(204).json();
  }

  res.status(200).json(deletedRevenue);
});

/**
 *  @desc    Get sum of all revenue transactions
 *  @route   GET /api/revenue/sum
 */
const getRevenueSum = asyncHandler(async (req, res, next) => {
  // const { _id: userId } = req.user;
  const totalRevenue = await Revenue.aggregate([
    // {
    //   $match: { userId },
    // },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  // If there are no revenue transactions, return 0 as total revenue
  const sum = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

  res.status(200).json({ totalRevenue: sum });
});

export {
  createRevenue,
  updateRevenue,
  deleteRevenue,
  getRevenue,
  getRevenueSum,
};
