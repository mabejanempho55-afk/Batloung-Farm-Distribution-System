
const db = require('../config/db');

const getAllVendors = async () => {
    const [rows] = await db.query(
        `SELECT
            v.*,
            COALESCE(SUM(s.total_amount - s.amount_paid), 0) AS outstanding_balance
        FROM Vendors v
        LEFT JOIN Sales s ON v.vendor_id = s.vendor_id
        GROUP BY v.vendor_id
        ORDER BY v.vendor_id DESC`
    );
    return rows;
};

const getVendorById = async (id) => {
    const [rows] = await db.query(
        `SELECT
            v.*,
            COALESCE(SUM(s.total_amount - s.amount_paid), 0) AS outstanding_balance
        FROM Vendors v
        LEFT JOIN Sales s ON v.vendor_id = s.vendor_id
        WHERE v.vendor_id = ?
        GROUP BY v.vendor_id`,
        [id]
    );
    return rows[0];
};

const searchVendors = async (term) => {
    const searchTerm = `%${term}%`;

    const [rows] = await db.query(
        `SELECT
            v.*,
            COALESCE(SUM(s.total_amount - s.amount_paid), 0) AS outstanding_balance
        FROM Vendors v
        LEFT JOIN Sales s ON v.vendor_id = s.vendor_id
        WHERE v.vendor_name LIKE ?
        OR v.phone_number LIKE ?
        OR v.location LIKE ?
        GROUP BY v.vendor_id
        ORDER BY v.vendor_name`,
        [searchTerm, searchTerm, searchTerm]
    );

    return rows;
};

const createVendor = async (vendor) => {
    const { vendor_name, phone_number, location, registration_date } = vendor;

    const [result] = await db.query(
        `INSERT INTO Vendors
        (vendor_name, phone_number, location, registration_date)
        VALUES (?, ?, ?, ?)`,
        [vendor_name, phone_number, location, registration_date]
    );

    return result.insertId;
};

const updateVendor = async (id, vendor) => {
    const { vendor_name, phone_number, location, registration_date } = vendor;

    const [result] = await db.query(
        `UPDATE Vendors
        SET vendor_name = ?, phone_number = ?, location = ?, registration_date = ?
        WHERE vendor_id = ?`,
        [vendor_name, phone_number, location, registration_date, id]
    );

    return result.affectedRows;
};

module.exports = {
    getAllVendors,
    getVendorById,
    searchVendors,
    createVendor,
    updateVendor
};
