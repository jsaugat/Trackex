import express from "express";
import {
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenses,
} from "../controllers/expenses.js";
import {
  createRevenue,
  updateRevenue,
  deleteRevenue,
  getRevenue,
  getRevenueSum,
} from "../controllers/revenue.js";
import { getInvoicePDF, createInvoicePDF } from "../controllers/invoice.js";
import { validateToken } from "../middlewares/validateToken.js";

const router = express.Router();

// Apply the middleware to all routes
// router.use(validateToken);

// Expense routes
router.route("/expenses")
  .get(validateToken, getExpenses)
  .post(createExpense);

router.route("/expenses/:id")
  .patch(updateExpense)
  .delete(deleteExpense);

// Revenue routes
router.route("/revenue")
  .get(validateToken, getRevenue)
  .post(createRevenue);

router.route("/revenue/:id")
  .patch(updateRevenue)
  .delete(deleteRevenue);

// Invoice routes
router.post('/revenue/invoice', createInvoicePDF);
router.get('/revenue/invoice/:fileName', getInvoicePDF);

// Route to get total revenue sum
router.get("/revenue/sum", validateToken, getRevenueSum);

export default router;
