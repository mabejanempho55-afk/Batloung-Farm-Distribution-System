const saleModel = require('../models/saleModel');

const addSale = async (req, res, next) => {
    try {
        const { vendor_id, payment_method, items } = req.body;

        const amount_paid = req.body.amount_paid === undefined
            ? 0
            : Number(req.body.amount_paid);

        if (!Number.isInteger(Number(vendor_id)) || Number(vendor_id) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'A valid vendor ID is required'
            });
        }

        if (!['CASH', 'MOBILE_MONEY', 'CREDIT'].includes(payment_method)) {
            return res.status(400).json({
                success: false,
                message: 'Payment method must be CASH, MOBILE_MONEY or CREDIT'
            });
        }

        if (
            !Number.isFinite(amount_paid) ||
            amount_paid < 0
        ) {
            return res.status(400).json({
                success: false,
                message: 'Amount paid must be a valid non-negative number'
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one sale item is required'
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
                    message: 'Each item must have a valid fruit ID, packaging size and quantity'
                });
            }
        }

        const sale = await saleModel.createSale({
            vendor_id: Number(vendor_id),
            payment_method,
            amount_paid,
            items: items.map(item => ({
                ...item,
                fruit_id: Number(item.fruit_id),
                quantity: Number(item.quantity)
            }))
        });

        res.status(201).json({
            success: true,
            message: 'Sale recorded and stock updated successfully',
            data: sale
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addSale
};