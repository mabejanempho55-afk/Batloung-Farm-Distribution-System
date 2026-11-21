const reportModel = require('../models/reportModel');

const getTopFruits = async (req, res, next) => {
    try {
        const data = await reportModel.getTopFruits();

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
};

const getRevenueByDate = async (req, res, next) => {
    try {
        const { start_date, end_date } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({
                success: false,
                message: 'Start date and end date are required'
            });
        }

        const datePattern = /^\d{4}-\d{2}-\d{2}$/;

        if (
            !datePattern.test(start_date) ||
            !datePattern.test(end_date) ||
            start_date > end_date
        ) {
            return res.status(400).json({
                success: false,
                message: 'Please provide valid dates in YYYY-MM-DD format'
            });
        }

        const data = await reportModel.getRevenueByDate(start_date, end_date);

        const totalRevenue = data.reduce(
            (total, row) => total + Number(row.daily_revenue),
            0
        );

        res.status(200).json({
            success: true,
            start_date,
            end_date,
            total_revenue: totalRevenue,
            data
        });
    } catch (error) {
        next(error);
    }
};

const getTopVendor = async (req, res, next) => {
    try {
        const data = await reportModel.getTopVendor();

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
};

const getCurrentStock = async (req, res, next) => {
    try {
        const data = await reportModel.getCurrentStock();

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
};
const getSalesByBoxSize = async (req, res, next) => {
    try {
        const data = await reportModel.getSalesByBoxSize();

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
};
const getSalesByStreetVendor = async (req, res, next) => {
    try {
        const data = await reportModel.getSalesByStreetVendor();

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
};
const getPurchasesByProvince = async (req, res, next) => {
    try {
        const data = await reportModel.getPurchasesByProvince();

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
};
const getPendingOrders = async (req, res, next) => {
    try {
        const data = await reportModel.getPendingOrders();

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
};
const getCompletedOrders = async (req, res, next) => {
    try {
        const data = await reportModel.getCompletedOrders();

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
};
const getTotalSalesByDate = async (req, res, next) => {
    try {
        const data = await reportModel.getTotalSalesByDate();

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {
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
};