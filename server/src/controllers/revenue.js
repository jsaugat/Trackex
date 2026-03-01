import mongoose from "mongoose";
import Revenue from "../models/Revenue.js";
import asyncHandler from "express-async-handler";
import AppError from "../utils/appError.js";

/**
 *  @desc    Add a revenue transaction
 *  @route   POST /api/revenue/
 */
const createRevenue = asyncHandler(async (req, res, next) => {
  const organizationId = req.user?.organization;
  if (!organizationId) {
    throw new AppError("Unable to determine organization context", 400);
  }

  const { revenueEntries } = req.body;
  const rawEntries = Array.isArray(revenueEntries) ? revenueEntries : [req.body];

  const normalizedEntries = rawEntries.map((entry) => ({
    ...entry,
    type: "revenue",
    organization: organizationId,
  }));

  if (Array.isArray(revenueEntries)) {
    const createdAllRevenue = await Revenue.insertMany(normalizedEntries);
    return res.status(201).json(createdAllRevenue);
  }

  const createdRevenue = await Revenue.create(normalizedEntries[0]);
  res.status(201).json(createdRevenue);
});

/**
 *  @desc    Get all revenue transactions
 *  @route   GET /api/revenue/
 */
const getRevenue = asyncHandler(async (req, res, next) => {
  const organizationId = req.user?.organization;
  if (!organizationId) {
    throw new AppError("Unable to determine organization context", 400);
  }

  const revenue = await Revenue.find({ organization: organizationId }).sort({
    createdAt: -1,
  });
  res.status(200).json(revenue);
});

/**
 *  @desc    Update a revenue transaction
 *  @route   PATCH /api/revenue/:id
 */
const updateRevenue = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const organizationId = req.user?.organization;
  if (!organizationId) {
    throw new AppError("Unable to determine organization context", 400);
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid revenue identifier", 404);
  }

  const updatedRevenue = await Revenue.findOneAndUpdate(
    { _id: id, organization: organizationId },
    req.body,
    { new: true }
  );

  if (!updatedRevenue) {
    throw new AppError("Revenue not found", 404);
  }

  res.status(200).json(updatedRevenue);
});

/**
 *  @desc    Delete a revenue transaction
 *  @route   DELETE /api/revenue/:id
 */
const deleteRevenue = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const organizationId = req.user?.organization;
  if (!organizationId) {
    throw new AppError("Unable to determine organization context", 400);
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid revenue identifier", 404);
  }

  const deletedRevenue = await Revenue.findOneAndDelete({
    _id: id,
    organization: organizationId,
  });

  if (!deletedRevenue) {
    throw new AppError("Revenue not found", 404);
  }

  res.status(200).json(deletedRevenue);
});

/**
 *  @desc    Get sum of all revenue transactions
 *  @route   GET /api/revenue/sum
 */
const getRevenueSum = asyncHandler(async (req, res, next) => {
  const organizationId = req.user?.organization;
  if (!organizationId) {
    throw new AppError("Unable to determine organization context", 400);
  }

  const totalRevenue = await Revenue.aggregate([
    { $match: { organization: organizationId } },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

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
