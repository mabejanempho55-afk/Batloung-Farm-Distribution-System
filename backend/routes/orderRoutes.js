
const express = require('express');
const router = express.Router();

const {
    addOrder,
    getAllOrders,
    changeOrderStatus
} = require('../controllers/orderController');

router.post('/', addOrder);
router.get('/', getAllOrders);
router.patch('/:id/status', changeOrderStatus);

module.exports = router;
