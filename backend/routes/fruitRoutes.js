const express = require('express');
const router = express.Router();

const {
    getFruits,
    getFruit,
    addFruit,
    editFruit,
    removeFruit,
    getStock,
    getLowStock
} = require('../controllers/fruitController');

router.get('/stock', getStock);
router.get('/low-stock', getLowStock);
router.get('/', getFruits);
router.get('/:id', getFruit);
router.post('/', addFruit);
router.put('/:id', editFruit);
router.delete('/:id', removeFruit);


module.exports = router;