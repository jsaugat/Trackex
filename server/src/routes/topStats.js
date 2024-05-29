import express from 'express';
import { getTopCustomers, getTopProductsByQuantity, getTopProductsByRevenue, getTopCategoriesByRevenue } from '../controllers/topStats.js';  // Adjust the path as necessary

const router = express.Router();

router.get('/top-customers', getTopCustomers);
router.get('/top-products-by-quantity', getTopProductsByQuantity);
router.get('/top-products-by-revenue', getTopProductsByRevenue);
router.get('/top-categories-by-revenue', getTopCategoriesByRevenue);

export default router;
