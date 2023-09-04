const express = require('express');
const router = express.Router();

const authenticateToken = require('../../middleware/authorization');
const PurchaseTransaction = require('../../models/Stock/purchaseTransaction');
const Stock = require('../../models/Stock/stock');
const PurchaseEntry = require('../../models/Purchases/purchaseEntry');
const Vendor = require('../../models/vendor');


router.get('/', authenticateToken, async (req, res) => {
    const purchaseTransaction = await PurchaseTransaction.findAll({include: [Stock, PurchaseEntry]})

    res.send(purchaseTransaction)
})

router.get('/stockid/:id', authenticateToken, async (req, res) => {
    const purchaseTransaction = await PurchaseTransaction.findOne({
        where: {stockId: req.params.id},
        include: [
            {model: Stock},
            {model: PurchaseEntry, include:{ model: Vendor}}
        ]}) 

    res.send(purchaseTransaction)
})
    
module.exports = router