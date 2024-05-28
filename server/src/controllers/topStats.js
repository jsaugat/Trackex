import asyncHandler from 'express-async-handler';
import Revenue from '../models/Revenue.js';  // Adjust the path as necessary

//? GET top customers by revenue
export const getTopCustomers = asyncHandler(async (req, res) => {
  const topCustomers = await Revenue.aggregate([
    { $match: { type: 'revenue' } },
    {
      $group: {
        _id: {
          $cond: {
            if: { $eq: ['$customer', ''] },
            then: 'Unknown',
            else: '$customer'
          }
        },
        totalRevenue: { $sum: '$amount' }
      }
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 30 },
  ]);
  res.status(200).json(topCustomers);
});

//? GET top selling products by quantity
export const getTopProductsByQuantity = asyncHandler(async (req, res) => {
  const topProductsByQuantity = await Revenue.aggregate([
    { $match: { type: 'revenue' } },
    { $group: { _id: { description: '$description', category: '$category' }, totalQuantity: { $sum: 1 } } },
    { $sort: { totalQuantity: -1 } },
    { $limit: 30 },
  ]);
  res.status(200).json(topProductsByQuantity);
});

//? GET top selling products by revenue
export const getTopProductsByRevenue = asyncHandler(async (req, res) => {
  const topProductsByRevenue = await Revenue.aggregate([
    { $match: { type: 'revenue' } },
    { $group: { _id: { description: '$description', category: '$category' }, totalRevenue: { $sum: '$amount' } } },
    { $sort: { totalRevenue: -1 } },
    { $limit: 30 },
  ]);

  res.status(200).json(topProductsByRevenue);
});

