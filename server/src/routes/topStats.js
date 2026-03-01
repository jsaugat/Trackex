import express from 'express';
import {
  getTopCustomers,
  getTopProductsByQuantity,
  getTopProductsByRevenue,
  getTopCategoriesByRevenue,
} from '../controllers/topStats.js';
import { validateToken } from "../middlewares/validateToken.js";

const router = express.Router();

router.get('/top-customers', validateToken, getTopCustomers);
router.get('/top-products-by-quantity', validateToken, getTopProductsByQuantity);
router.get('/top-products-by-revenue', validateToken, getTopProductsByRevenue);
router.get('/top-categories-by-revenue', validateToken, getTopCategoriesByRevenue);

export default router;
