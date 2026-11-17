const express = require('express');
const router = express.Router();

const {
    getVendors,
    getVendor,
    searchVendors,
    addVendor,
    editVendor
} = require('../controllers/vendorController');

router.get('/search', searchVendors);
router.get('/', getVendors);
router.get('/:id', getVendor);
router.post('/', addVendor);
router.put('/:id', editVendor);

module.exports = router;