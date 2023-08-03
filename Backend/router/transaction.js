const express = require('express');
const Transaction = require('../models/transaction');
const router = express.Router();
const Stock = require('../models/stock');
const Customer = require('../models/Customer/customer');
const Product = require('../models/Products/product');


router.post('/', async (req, res) => {
    try {
            const { stockId, stockIn, stockOut, financialYearId, customerId, productId} = req.body;

            const transaction = new Transaction({stockId, stockIn, stockOut, financialYearId, customerId, productId});

            await transaction.save();

            res.send(transaction);

    } catch (error) {
        res.send(error);
    }
})

router.get('/', async (req, res) => {

    const transaction = await Transaction.findAll({include :[Stock, Customer, Product]})

    res.send(transaction);
})
module.exports = router;