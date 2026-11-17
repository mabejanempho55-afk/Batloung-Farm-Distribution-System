const db = require('../config/db');

const getAllSuppliers = async () => {
    const [rows] = await db.query(
        'SELECT * FROM Suppliers ORDER BY supplier_id DESC'
    );
    return rows;
};

const getSupplierById = async (id) => {
    const [rows] = await db.query(
        'SELECT * FROM Suppliers WHERE supplier_id = ?',
        [id]
    );
    return rows[0];
};

const createSupplier = async (supplier) => {
    const { business_name, contact_person, phone, province, address } = supplier;

    const [result] = await db.query(
        `INSERT INTO Suppliers
        (business_name, contact_person, phone, province, address)
        VALUES (?, ?, ?, ?, ?)`,
        [business_name, contact_person, phone, province, address]
    );

    return result.insertId;
};

const updateSupplier = async (id, supplier) => {
    const { business_name, contact_person, phone, province, address } = supplier;

    const [result] = await db.query(
        `UPDATE Suppliers
        SET business_name = ?, contact_person = ?, phone = ?, province = ?, address = ?
        WHERE supplier_id = ?`,
        [business_name, contact_person, phone, province, address, id]
    );

    return result.affectedRows;
};

const deleteSupplier = async (id) => {
    const [result] = await db.query(
        'DELETE FROM Suppliers WHERE supplier_id = ?',
        [id]
    );

    return result.affectedRows;
};

module.exports = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};