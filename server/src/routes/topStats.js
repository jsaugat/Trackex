import express from 'express';
import { getTopCustomers, getTopProductsByQuantity, getTopProductsByRevenue } from '../controllers/topStats.js';  // Adjust the path as necessary

const router = express.Router();

router.get('/top-customers', getTopCustomers);
router.get('/top-products-by-quantity', getTopProductsByQuantity);
router.get('/top-products-by-revenue', getTopProductsByRevenue);

export default router;
