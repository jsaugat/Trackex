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
  .post(validateToken, createExpense);

router.route("/expenses/:id")
  .patch(validateToken, updateExpense)
  .delete(validateToken, deleteExpense);

// Revenue routes
router.route("/revenue")
  .get(validateToken, getRevenue)
  .post(validateToken, createRevenue);

router.route("/revenue/:id")
  .patch(validateToken, updateRevenue)
  .delete(validateToken, deleteRevenue);

// Invoice routes
router.post('/revenue/invoice', createInvoicePDF);
router.get('/revenue/invoice/:fileName', getInvoicePDF);

// Route to get total revenue sum
router.get("/revenue/sum", validateToken, getRevenueSum);

export default router;
