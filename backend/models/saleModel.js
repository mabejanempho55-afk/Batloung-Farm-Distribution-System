const db = require('../config/db');

const createSale = async (sale) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const { vendor_id, payment_method, amount_paid, items } = sale;

        const [vendors] = await connection.query(
            'SELECT vendor_id FROM Vendors WHERE vendor_id = ?',
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

        const quantities = new Map();

        for (const item of items) {
            const key = `${item.fruit_id}-${item.packaging_size}`;

            if (quantities.has(key)) {
                quantities.get(key).quantity += item.quantity;
            } else {
                quantities.set(key, { ...item });
            }
        }

        const saleItems = [];
        let totalAmount = 0;

        for (const item of quantities.values()) {
            const { fruit_id, packaging_size, quantity } = item;
            const priceColumn = priceColumns[packaging_size];

            const [fruits] = await connection.query(
                `SELECT fruit_name, status, ${priceColumn} AS unit_price
                FROM Fruits WHERE fruit_id = ?`,
                [fruit_id]
            );

            if (fruits.length === 0) {
                const error = new Error(`Fruit ID ${fruit_id} not found`);
                error.statusCode = 404;
                throw error;
            }

            const fruit = fruits[0];

            if (fruit.status !== 'Available') {
                const error = new Error(`${fruit.fruit_name} is unavailable`);
                error.statusCode = 400;
                throw error;
            }

            const [stockRows] = await connection.query(
                `SELECT available_quantity FROM Stock
                WHERE fruit_id = ? AND packaging_size = ?
                FOR UPDATE`,
                [fruit_id, packaging_size]
            );

            if (
                stockRows.length === 0 ||
                stockRows[0].available_quantity < quantity
            ) {
                const error = new Error(
                    `Insufficient stock for ${fruit.fruit_name} (${packaging_size})`
                );
                error.statusCode = 400;
                throw error;
            }

            const unitPrice = Number(fruit.unit_price);
            totalAmount += quantity * unitPrice;

            saleItems.push({
                fruit_id,
                packaging_size,
                quantity,
                unit_price: unitPrice
            });
        }

        if (amount_paid > totalAmount) {
            const error = new Error('Amount paid cannot exceed the sale total');
            error.statusCode = 400;
            throw error;
        }

        let paymentStatus = 'UNPAID';

        if (amount_paid === totalAmount) {
            paymentStatus = 'PAID';
        } else if (amount_paid > 0) {
            paymentStatus = 'PARTIALLY_PAID';
        }

        const [saleResult] = await connection.query(
            `INSERT INTO Sales
            (vendor_id, total_amount, amount_paid, payment_method, payment_status)
            VALUES (?, ?, ?, ?, ?)`,
            [vendor_id, totalAmount, amount_paid, payment_method, paymentStatus]
        );

        const saleId = saleResult.insertId;

        for (const item of saleItems) {
            await connection.query(
                `INSERT INTO Sales_Details
                (sale_id, fruit_id, packaging_size, quantity, unit_price)
                VALUES (?, ?, ?, ?, ?)`,
                [
                    saleId,
                    item.fruit_id,
                    item.packaging_size,
                    item.quantity,
                    item.unit_price
                ]
            );

            await connection.query(
                `UPDATE Stock
                SET available_quantity = available_quantity - ?
                WHERE fruit_id = ? AND packaging_size = ?
                AND available_quantity >= ?`,
                [
                    item.quantity,
                    item.fruit_id,
                    item.packaging_size,
                    item.quantity
                ]
            );
        }

        await connection.commit();

        return {
            sale_id: saleId,
            total_amount: totalAmount,
            amount_paid,
            outstanding_balance: totalAmount - amount_paid,
            payment_status: paymentStatus
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    createSale
};