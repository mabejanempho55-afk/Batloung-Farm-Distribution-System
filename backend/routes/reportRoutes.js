const express = require('express');
const router = express.Router();

const {
    getTopFruits,
    getRevenueByDate,
    getTopVendor,
    getCurrentStock
} = require('../controllers/reportController');

router.get('/top-fruits', getTopFruits);
router.get('/revenue', getRevenueByDate);
router.get('/top-vendor', getTopVendor);
router.get('/stock', getCurrentStock);

module.exports = router;