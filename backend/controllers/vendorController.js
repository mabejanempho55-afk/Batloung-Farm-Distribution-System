const vendorModel = require('../models/vendorModel');

const getVendors = async (req, res, next) => {
    try {
        const vendors = await vendorModel.getAllVendors();

        res.status(200).json({
            success: true,
            data: vendors
        });
    } catch (error) {
        next(error);
    }
};

const getVendor = async (req, res, next) => {
    try {
        const vendor = await vendorModel.getVendorById(req.params.id);

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        res.status(200).json({
            success: true,
            data: vendor
        });
    } catch (error) {
        next(error);
    }
};

const searchVendors = async (req, res, next) => {
    try {
        const term = req.query.term;

        if (!term || !term.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a search term'
            });
        }

        const vendors = await vendorModel.searchVendors(term.trim());

        res.status(200).json({
            success: true,
            data: vendors
        });
    } catch (error) {
        next(error);
    }
};

const addVendor = async (req, res, next) => {
    try {
        const { vendor_name, phone_number, location, registration_date } = req.body;

        if (!vendor_name || !phone_number || !location || !registration_date) {
            return res.status(400).json({
                success: false,
                message: 'All vendor fields are required'
            });
        }

        const id = await vendorModel.createVendor(req.body);

        res.status(201).json({
            success: true,
            message: 'Vendor registered successfully',
            vendor_id: id
        });
    } catch (error) {
        next(error);
    }
};

const editVendor = async (req, res, next) => {
    try {
        const { vendor_name, phone_number, location, registration_date } = req.body;

        if (!vendor_name || !phone_number || !location || !registration_date) {
            return res.status(400).json({
                success: false,
                message: 'All vendor fields are required'
            });
        }

        const result = await vendorModel.updateVendor(req.params.id, req.body);

        if (result === 0) {
            const vendor = await vendorModel.getVendorById(req.params.id);

            if (!vendor) {
                return res.status(404).json({
                    success: false,
                    message: 'Vendor not found'
                });
            }
        }

        res.status(200).json({
            success: true,
            message: 'Vendor updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getVendors,
    getVendor,
    searchVendors,
    addVendor,
    editVendor
};