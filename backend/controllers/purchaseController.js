const purchaseModel = require('../models/purchaseModel');

const addPurchase = async (req, res, next) => {
    try {
        const { supplier_id, items } = req.body;

        if (!Number.isInteger(Number(supplier_id)) || Number(supplier_id) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'A valid supplier ID is required'
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one purchase item is required'
            });
        }

        for (const item of items) {
            const { fruit_id, packaging_size, quantity, unit_cost } = item;

            if (
                !Number.isInteger(Number(fruit_id)) ||
                Number(fruit_id) <= 0 ||
                !['Small', 'Medium', 'Large'].includes(packaging_size) ||
                !Number.isInteger(Number(quantity)) ||
                Number(quantity) <= 0 ||
                unit_cost === undefined ||
                unit_cost === null ||
                !Number.isFinite(Number(unit_cost)) ||
                Number(unit_cost) < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Each item must have a valid fruit ID, packaging size, quantity and unit cost'
                });
            }
        }

        const purchase = await purchaseModel.createPurchase({
            supplier_id: Number(supplier_id),
            items
        });

        res.status(201).json({
            success: true,
            message: 'Purchase recorded and stock updated successfully',
            data: purchase
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addPurchase
};