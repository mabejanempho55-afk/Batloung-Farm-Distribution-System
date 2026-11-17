const db = require('../config/db');

const createPurchase = async (purchase) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const { supplier_id, items } = purchase;

        const [suppliers] = await connection.query(
            'SELECT supplier_id FROM Suppliers WHERE supplier_id = ?',
            [supplier_id]
        );

        if (suppliers.length === 0) {
            const error = new Error('Supplier not found');
            error.statusCode = 404;
            throw error;
        }

        const [purchaseResult] = await connection.query(
            'INSERT INTO Purchases (supplier_id, total_amount) VALUES (?, 0)',
            [supplier_id]
        );

        const purchaseId = purchaseResult.insertId;
        let totalAmount = 0;

        for (const item of items) {
            const { fruit_id, packaging_size, quantity, unit_cost } = item;

            const [fruits] = await connection.query(
                'SELECT fruit_id FROM Fruits WHERE fruit_id = ?',
                [fruit_id]
            );

            if (fruits.length === 0) {
                const error = new Error(`Fruit ID ${fruit_id} not found`);
                error.statusCode = 404;
                throw error;
            }

            await connection.query(
                `INSERT INTO Purchase_Details
                (purchase_id, fruit_id, packaging_size, quantity, unit_cost)
                VALUES (?, ?, ?, ?, ?)`,
                [purchaseId, fruit_id, packaging_size, quantity, unit_cost]
            );

            totalAmount += quantity * unit_cost;

            await connection.query(
                `INSERT INTO Stock
                (fruit_id, packaging_size, available_quantity)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE
                available_quantity = available_quantity + VALUES(available_quantity)`,
                [fruit_id, packaging_size, quantity]
            );
        }

        await connection.query(
            'UPDATE Purchases SET total_amount = ? WHERE purchase_id = ?',
            [totalAmount, purchaseId]
        );

        await connection.commit();

        return {
            purchase_id: purchaseId,
            total_amount: totalAmount
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    createPurchase
};