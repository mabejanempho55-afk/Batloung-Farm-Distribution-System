const db = require('../config/db');

const getAllFruits = async () => {
    const [rows] = await db.query(
        'SELECT * FROM Fruits ORDER BY fruit_id DESC'
    );
    return rows;
};

const getFruitById = async (id) => {
    const [rows] = await db.query(
        'SELECT * FROM Fruits WHERE fruit_id = ?',
        [id]
    );
    return rows[0];
};

const createFruit = async (fruit) => {
    const {
        fruit_name,
        description,
        small_selling_price,
        medium_selling_price,
        large_selling_price
    } = fruit;

    const [result] = await db.query(
        `INSERT INTO Fruits
        (fruit_name, description, small_selling_price, medium_selling_price, large_selling_price)
        VALUES (?, ?, ?, ?, ?)`,
        [
            fruit_name,
            description,
            small_selling_price,
            medium_selling_price,
            large_selling_price
        ]
    );

    return result.insertId;
};

const updateFruit = async (id, fruit) => {
    const {
        fruit_name,
        description,
        status,
        small_selling_price,
        medium_selling_price,
        large_selling_price
    } = fruit;

    const [result] = await db.query(
        `UPDATE Fruits
        SET fruit_name = ?, description = ?, status = ?,
        small_selling_price = ?, medium_selling_price = ?, large_selling_price = ?
        WHERE fruit_id = ?`,
        [
            fruit_name,
            description,
            status,
            small_selling_price,
            medium_selling_price,
            large_selling_price,
            id
        ]
    );

    return result.affectedRows;
};

const deleteFruit = async (id) => {
    const [result] = await db.query(
        'DELETE FROM Fruits WHERE fruit_id = ?',
        [id]
    );

    return result.affectedRows;
};

const getFruitStock = async () => {
    const [rows] = await db.query(
        `SELECT f.fruit_name, s.packaging_size, s.available_quantity
        FROM Stock s
        JOIN Fruits f ON s.fruit_id = f.fruit_id
        ORDER BY f.fruit_name, s.packaging_size`
    );

    return rows;
};
const getLowStock = async (threshold = 10) => {
    const [rows] = await db.query(
        `SELECT f.fruit_name, s.packaging_size, s.available_quantity
        FROM Stock s
        JOIN Fruits f ON s.fruit_id = f.fruit_id
        WHERE s.available_quantity <= ?
        ORDER BY s.available_quantity ASC`,
        [threshold]
    );

    return rows;
};

module.exports = {
    getAllFruits,
    getFruitById,
    createFruit,
    updateFruit,
    deleteFruit,
    getFruitStock,
    getLowStock
};