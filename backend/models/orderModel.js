
const db = require('../config/db');

const createOrder = async (order) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const { vendor_id, items } = order;

        const [vendors] = await connection.query(
            'SELECT vendor_id FROM vendors WHERE vendor_id = ?',
            [vendor_id]
        );

        if (vendors.length === 0) {
            const error = new Error('Vendor not found');
            error.statusCode = 404;
            throw error;
        }

        const priceColumns = {
            Small: 'small_selling_price',
            Medium: 'medium_selling_price',
            Large: 'large_selling_price'
        };

        const orderItems = [];
        let totalAmount = 0;

        for (const item of items) {
            const { fruit_id, packaging_size, quantity } = item;
            const priceColumn = priceColumns[packaging_size];

            const [fruits] = await connection.query(
                `SELECT fruit_name, status, ${priceColumn} AS unit_price
                FROM fruits WHERE fruit_id = ?`,
                [fruit_id]
            );

            if (fruits.length === 0) {
                const error = new Error(`Fruit ID ${fruit_id} not found`);
                error.statusCode = 404;
                throw error;
            }

            if (fruits[0].status !== 'Available') {
                const error = new Error(`${fruits[0].fruit_name} is unavailable`);
                error.statusCode = 400;
                throw error;
            }

            const [stockRows] = await connection.query(
                `SELECT available_quantity FROM stock
                WHERE fruit_id = ? AND packaging_size = ?`,
                [fruit_id, packaging_size]
            );

            const existingStock = stockRows.length > 0
                ? Number(stockRows[0].available_quantity)
                : 0;

            if (existingStock < quantity) {
                const error = new Error(
                    `Insufficient stock for ${fruits[0].fruit_name} (${packaging_size})`
                );
                error.statusCode = 400;
                throw error;
            }

            const unitPrice = Number(fruits[0].unit_price);
            const subtotal = quantity * unitPrice;

            totalAmount += subtotal;

            orderItems.push({
                fruit_id,
                packaging_size,
                quantity,
                unit_price: unitPrice,
                subtotal
            });
        }

        const [orderResult] = await connection.query(
            `INSERT INTO orders (vendor_id, total_amount, order_status)
            VALUES (?, ?, 'Pending')`,
            [vendor_id, totalAmount]
        );

        const orderId = orderResult.insertId;

        for (const item of orderItems) {
            await connection.query(
                `INSERT INTO order_items
                (order_id, fruit_id, packaging_size, quantity, unit_price, subtotal)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    orderId,
                    item.fruit_id,
                    item.packaging_size,
                    item.quantity,
                    item.unit_price,
                    item.subtotal
                ]
            );
        }

        await connection.commit();

        return {
            order_id: orderId,
            vendor_id,
            total_amount: totalAmount,
            order_status: 'Pending',
            items: orderItems
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const getOrders = async () => {
    const [orders] = await db.query(
        `SELECT o.order_id, o.vendor_id, v.vendor_name,
        o.order_date, o.total_amount, o.order_status
        FROM orders o
        JOIN vendors v ON o.vendor_id = v.vendor_id
        ORDER BY o.order_date DESC`
    );

    for (const order of orders) {
        const [items] = await db.query(
            `SELECT oi.order_item_id, oi.fruit_id, f.fruit_name,
            oi.packaging_size, oi.quantity, oi.unit_price, oi.subtotal
            FROM order_items oi
            JOIN fruits f ON oi.fruit_id = f.fruit_id
            WHERE oi.order_id = ?`,
            [order.order_id]
        );

        order.items = items;
    }

    return orders;
};

const updateOrderStatus = async (orderId, newStatus) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [orders] = await connection.query(
            `SELECT order_id, order_status
            FROM orders WHERE order_id = ? FOR UPDATE`,
            [orderId]
        );

        if (orders.length === 0) {
            const error = new Error('Order not found');
            error.statusCode = 404;
            throw error;
        }

        const currentStatus = orders[0].order_status;

        if (currentStatus === 'Completed' || currentStatus === 'Cancelled') {
            const error = new Error(
                'Completed or cancelled orders cannot be changed'
            );
            error.statusCode = 400;
            throw error;
        }

        if (newStatus === 'Completed') {
            const [items] = await connection.query(
                `SELECT fruit_id, packaging_size, quantity
                FROM order_items WHERE order_id = ?`,
                [orderId]
            );

            for (const item of items) {
                const [stockRows] = await connection.query(
                    `SELECT available_quantity FROM stock
                    WHERE fruit_id = ? AND packaging_size = ?
                    FOR UPDATE`,
                    [item.fruit_id, item.packaging_size]
                );

                if (
                    stockRows.length === 0 ||
                    Number(stockRows[0].available_quantity) < item.quantity
                ) {
                    const error = new Error(
                        'Insufficient stock to complete this order'
                    );
                    error.statusCode = 400;
                    throw error;
                }

                await connection.query(
                    `UPDATE stock
                    SET available_quantity = available_quantity - ?
                    WHERE fruit_id = ? AND packaging_size = ?`,
                    [item.quantity, item.fruit_id, item.packaging_size]
                );
            }
        }

        await connection.query(
            'UPDATE orders SET order_status = ? WHERE order_id = ?',
            [newStatus, orderId]
        );

        await connection.commit();

        return {
            order_id: Number(orderId),
            order_status: newStatus
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus
};
