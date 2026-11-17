const express = require('express');
const router = express.Router();

const {
    getSuppliers,
    getSupplier,
    addSupplier,
    editSupplier,
    removeSupplier
} = require('../controllers/supplierController');

router.get('/', getSuppliers);
router.get('/:id', getSupplier);
router.post('/', addSupplier);
router.put('/:id', editSupplier);
router.delete('/:id', removeSupplier);

module.exports = router;