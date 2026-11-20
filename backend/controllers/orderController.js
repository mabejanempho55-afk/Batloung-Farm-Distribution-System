
const orderModel = require('../models/orderModel');

const allowedStatuses = [
    'Pending',
    'Confirmed',
    'Processing',
    'Ready for Collection/Delivery',
    'Completed',
    'Cancelled'
];

const addOrder = async (req, res, next) => {
    try {
        const { vendor_id, items } = req.body;

        if (!Number.isInteger(Number(vendor_id)) || Number(vendor_id) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'A valid vendor ID is required'
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one order item is required'
            });
        }

        for (const item of items) {
            const { fruit_id, packaging_size, quantity } = item;

            if (
                !Number.isInteger(Number(fruit_id)) ||
                Number(fruit_id) <= 0 ||
                !['Small', 'Medium', 'Large'].includes(packaging_size) ||
                !Number.isInteger(Number(quantity)) ||
                Number(quantity) <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Each item must have a valid fruit ID, box size and quantity'
                });
            }
        }

        const order = await orderModel.createOrder({
            vendor_id: Number(vendor_id),
            items: items.map(item => ({
                fruit_id: Number(item.fruit_id),
                packaging_size: item.packaging_size,
                quantity: Number(item.quantity)
            }))
        });

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });
    } catch (error) {
        next(error);
    }
};

const getAllOrders = async (req, res, next) => {
    try {
        const orders = await orderModel.getOrders();

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

const changeOrderStatus = async (req, res, next) => {
    try {
        const orderId = Number(req.params.id);
        const { order_status } = req.body;

        if (!Number.isInteger(orderId) || orderId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'A valid order ID is required'
            });
        }

        if (!allowedStatuses.includes(order_status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order status'
            });
        }

        const order = await orderModel.updateOrderStatus(
            orderId,
            order_status
        );

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addOrder,
    getAllOrders,
    changeOrderStatus
};
