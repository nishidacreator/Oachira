const express = require('express');
const router = express.Router();

const Stock = require('../../models/Stock/stock');
const authenticateToken = require('../../middleware/authorization');
const Product = require('../../models/Products/product');

router.get('/', authenticateToken, async(req, res) => {
    const stock = await Stock.findAll({include: [Product]})

    res.send(stock)
});

router.get('/:id', authenticateToken, async(req, res) => {
    const stock = await Stock.findOne({
        where: {id: req.params.id},
        include: [Product]
    })

    res.send(stock)
});


module.exports = router