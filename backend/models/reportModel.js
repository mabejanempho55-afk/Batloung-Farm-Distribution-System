
const db = require('../config/db');

const getTopFruits = async () => {
    const [rows] = await db.query(
        `SELECT
            f.fruit_name,
            SUM(sd.quantity) AS total_boxes,
            SUM(sd.quantity * sd.unit_price) AS total_revenue
        FROM Sales_Details sd
        JOIN Fruits f ON sd.fruit_id = f.fruit_id
        GROUP BY f.fruit_id, f.fruit_name
        ORDER BY total_boxes DESC
        LIMIT 5`
    );

    return rows;
};

const getRevenueByDate = async (startDate, endDate) => {
    const [rows] = await db.query(
        `SELECT
            DATE(sale_date) AS sale_date,
            SUM(total_amount) AS daily_revenue
        FROM Sales
        WHERE sale_date >= ?
        AND sale_date < DATE_ADD(?, INTERVAL 1 DAY)
        GROUP BY DATE(sale_date)
        ORDER BY sale_date`,
        [startDate, endDate]
    );

    return rows;
};

const getTopVendor = async () => {
    const [rows] = await db.query(
        `SELECT
            v.vendor_id,
            v.vendor_name,
            SUM(sd.quantity) AS total_boxes
        FROM Sales s
        JOIN Vendors v ON s.vendor_id = v.vendor_id
        JOIN Sales_Details sd ON s.sale_id = sd.sale_id
        GROUP BY v.vendor_id, v.vendor_name
        ORDER BY total_boxes DESC
        LIMIT 1`
    );

    return rows[0] || null;
};

const getCurrentStock = async () => {
    const [rows] = await db.query(
        `SELECT
            f.fruit_name,
            st.packaging_size,
            st.available_quantity
        FROM Stock st
        JOIN Fruits f ON st.fruit_id = f.fruit_id
        ORDER BY f.fruit_name, st.packaging_size`
    );

    return rows;
};

const getSalesByBoxSize = async () => {
    const [rows] = await db.query(
        `SELECT
            packaging_size,
            SUM(quantity) AS total_boxes,
            SUM(quantity * unit_price) AS total_revenue
        FROM Sales_Details
        GROUP BY packaging_size
        ORDER BY packaging_size`
    );

    return rows;
};

const getSalesByStreetVendor = async () => {
    const [rows] = await db.query(
        `SELECT
            v.vendor_id,
            v.vendor_name,
            SUM(sd.quantity) AS total_boxes,
            SUM(sd.quantity * sd.unit_price) AS total_revenue
        FROM Sales s
        JOIN Vendors v ON s.vendor_id = v.vendor_id
        JOIN Sales_Details sd ON s.sale_id = sd.sale_id
        GROUP BY v.vendor_id, v.vendor_name
        ORDER BY total_revenue DESC`
    );

    return rows;
};

const getPurchasesByProvince = async () => {
    const [rows] = await db.query(
        `SELECT
            s.province,
            SUM(p.total_amount) AS total_purchases
        FROM Suppliers s
        JOIN Purchases p ON s.supplier_id = p.supplier_id
        GROUP BY s.province
        ORDER BY total_purchases DESC`
    );

    return rows;
};

const getPendingOrders = async () => {
    const [rows] = await db.query(
        `SELECT
            o.order_id,
            v.vendor_name,
            o.order_date,
            o.total_amount,
            o.order_status
        FROM orders o
        JOIN vendors v ON o.vendor_id = v.vendor_id
        WHERE o.order_status = 'Pending'
        ORDER BY o.order_date DESC`
    );

    return rows;
};

const getCompletedOrders = async () => {
    const [rows] = await db.query(
        `SELECT
            o.order_id,
            v.vendor_name,
            o.order_date,
            o.total_amount,
            o.order_status
        FROM orders o
        JOIN vendors v ON o.vendor_id = v.vendor_id
        WHERE o.order_status = 'Completed'
        ORDER BY o.order_date DESC`
    );

    return rows;
};

const getTotalSalesByDate = async () => {
    const [rows] = await db.query(
        `SELECT
            DATE(sale_date) AS sale_date,
            COUNT(*) AS total_sales,
            SUM(total_amount) AS total_revenue
        FROM Sales
        GROUP BY DATE(sale_date)
        ORDER BY sale_date DESC`
    );

    return rows;
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
