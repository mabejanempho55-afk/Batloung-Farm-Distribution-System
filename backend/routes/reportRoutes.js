const express = require('express');
const router = express.Router();

const {
    getTopFruits,
    getRevenueByDate,
    getTopVendor,
    getCurrentStock,
    getSalesByBoxSize,
    getSalesByStreetVendor,
    getPurchasesByProvince,
    getPendingOrders,
    getCompletedOrders,
    getTotalSalesByDate
} = require('../controllers/reportController');

router.get('/top-fruits', getTopFruits);
router.get('/revenue', getRevenueByDate);
router.get('/top-vendor', getTopVendor);
router.get('/stock', getCurrentStock);
router.get('/sales-by-box-size', getSalesByBoxSize);
router.get('/sales-by-street-vendor', getSalesByStreetVendor);
router.get('/purchases-by-province', getPurchasesByProvince);
router.get('/pending-orders', getPendingOrders);
router.get('/completed-orders', getCompletedOrders);
router.get('/total-sales-by-date', getTotalSalesByDate);

module.exports = router;