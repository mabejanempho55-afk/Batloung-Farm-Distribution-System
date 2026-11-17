const supplierModel = require('../models/supplierModel');

const getSuppliers = async (req, res, next) => {
    try {
        const suppliers = await supplierModel.getAllSuppliers();

        res.status(200).json({
            success: true,
            data: suppliers
        });
    } catch (error) {
        next(error);
    }
};

const getSupplier = async (req, res, next) => {
    try {
        const supplier = await supplierModel.getSupplierById(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: 'Supplier not found'
            });
        }

        res.status(200).json({
            success: true,
            data: supplier
        });
    } catch (error) {
        next(error);
    }
};

const addSupplier = async (req, res, next) => {
    try {
        const { business_name, contact_person, phone, province, address } = req.body;

        if (!business_name || !contact_person || !phone || !province || !address) {
            return res.status(400).json({
                success: false,
                message: 'All supplier fields are required'
            });
        }

        const id = await supplierModel.createSupplier(req.body);

        res.status(201).json({
            success: true,
            message: 'Supplier added successfully',
            supplier_id: id
        });
    } catch (error) {
        next(error);
    }
};

const editSupplier = async (req, res, next) => {
    try {
        const { business_name, contact_person, phone, province, address } = req.body;

        if (!business_name || !contact_person || !phone || !province || !address) {
            return res.status(400).json({
                success: false,
                message: 'All supplier fields are required'
            });
        }

        const result = await supplierModel.updateSupplier(req.params.id, req.body);

        if (result === 0) {
            return res.status(404).json({
                success: false,
                message: 'Supplier not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Supplier updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

const removeSupplier = async (req, res, next) => {
    try {
        const result = await supplierModel.deleteSupplier(req.params.id);

        if (result === 0) {
            return res.status(404).json({
                success: false,
                message: 'Supplier not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Supplier deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSuppliers,
    getSupplier,
    addSupplier,
    editSupplier,
    removeSupplier
};