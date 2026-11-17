const fruitModel = require('../models/fruitModel');

const getFruits = async (req, res, next) => {
    try {
        const fruits = await fruitModel.getAllFruits();

        res.status(200).json({
            success: true,
            data: fruits
        });
    } catch (error) {
        next(error);
    }
};

const getFruit = async (req, res, next) => {
    try {
        const fruit = await fruitModel.getFruitById(req.params.id);

        if (!fruit) {
            return res.status(404).json({
                success: false,
                message: 'Fruit not found'
            });
        }

        res.status(200).json({
            success: true,
            data: fruit
        });
    } catch (error) {
        next(error);
    }
};

const addFruit = async (req, res, next) => {
    try {
        const {
            fruit_name,
            small_selling_price,
            medium_selling_price,
            large_selling_price
        } = req.body;

        if (
            !fruit_name ||
            small_selling_price === undefined ||
            medium_selling_price === undefined ||
            large_selling_price === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: 'Fruit name and all three selling prices are required'
            });
        }

        const prices = [
            small_selling_price,
            medium_selling_price,
            large_selling_price
        ];

        if (prices.some(price => !Number.isFinite(Number(price)) || Number(price) < 0)) {
            return res.status(400).json({
                success: false,
                message: 'Selling prices must be valid non-negative numbers'
            });
        }

        const id = await fruitModel.createFruit(req.body);

        res.status(201).json({
            success: true,
            message: 'Fruit added successfully',
            fruit_id: id
        });
    } catch (error) {
        next(error);
    }
};

const editFruit = async (req, res, next) => {
    try {
        const {
            fruit_name,
            status,
            small_selling_price,
            medium_selling_price,
            large_selling_price
        } = req.body;

        if (
            !fruit_name ||
            !status ||
            small_selling_price === undefined ||
            medium_selling_price === undefined ||
            large_selling_price === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: 'Fruit name, status and all three selling prices are required'
            });
        }

        const prices = [
            small_selling_price,
            medium_selling_price,
            large_selling_price
        ];

        if (prices.some(price => !Number.isFinite(Number(price)) || Number(price) < 0)) {
            return res.status(400).json({
                success: false,
                message: 'Selling prices must be valid non-negative numbers'
            });
        }

        if (!['Available', 'Unavailable'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid fruit status'
            });
        }

        const result = await fruitModel.updateFruit(req.params.id, req.body);

        if (result === 0) {
            const existingFruit = await fruitModel.getFruitById(req.params.id);

            if (!existingFruit) {
                return res.status(404).json({
                    success: false,
                    message: 'Fruit not found'
                });
            }
        }

        res.status(200).json({
            success: true,
            message: 'Fruit updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

const removeFruit = async (req, res, next) => {
    try {
        const result = await fruitModel.deleteFruit(req.params.id);

        if (result === 0) {
            return res.status(404).json({
                success: false,
                message: 'Fruit not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Fruit deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

const getStock = async (req, res, next) => {
    try {
        const stock = await fruitModel.getFruitStock();

        res.status(200).json({
            success: true,
            data: stock
        });
    } catch (error) {
        next(error);
    }
};
const getLowStock = async (req, res, next) => {
    try {
        const threshold = Number(req.query.threshold || 10);

        if (!Number.isInteger(threshold) || threshold < 0) {
            return res.status(400).json({
                success: false,
                message: 'Threshold must be a valid non-negative number'
            });
        }

        const stock = await fruitModel.getLowStock(threshold);

        res.status(200).json({
            success: true,
            threshold,
            data: stock
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getFruits,
    getFruit,
    addFruit,
    editFruit,
    removeFruit,
    getStock,
    getLowStock

};