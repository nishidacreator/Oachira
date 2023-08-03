const express = require('express');
const Stock = require('../models/stock');
const router = express.Router();
const authorization = require('../middleware/authorization');
const Product = require('../models/Products/product');
const PrimaryUnit = require('../models/Products/primayUnit');
const SecondaryUnit = require('../models/Products/secondaryUnit');


router.post('/', async (req, res) => {
    try {
            const {productId, primaryUnitId, primaryQuantity, secondaryUnitId, secondaryQuantity, mrp,
                amount, landingCost, sellingPrice, hsnCode, cgst, sgst, igst, discount, discountShared,
                profitMargin1, profitMargin2} = req.body;

            const stock = new Stock({productId, primaryUnitId, primaryQuantity, secondaryUnitId, secondaryQuantity, mrp,
                amount, landingCost, sellingPrice, hsnCode, cgst, sgst, igst, discount, discountShared,
                profitMargin1, profitMargin2});

            await stock.save();

            res.send(stock);

    } catch (error) {
        res.send(error);
    }
})

router.get('/', async(req,res)=>{

    try {
        const stock = await Stock.findAll({include : [Product, PrimaryUnit, SecondaryUnit]});
        res.send(stock);
        
    } catch (error) {
        res.send(error.message);
    }  
})


// router.delete('/:id', async(req,res)=>{
//     try {

//         const result = await Stock.destroy({
//             where: { id: req.params.id },
//             force: true,
//         });

//         if (result === 0) {
//             return res.status(404).json({
//               status: "fail",
//               message: "Stock with that ID not found",
//             });
//           }
      
//           res.status(204).json();
//         }  catch (error) {
//         res.send({error: error.message})
//     }
    
// })

// router.patch('/:id', async(req,res)=>{
//     try {
//         Stock.update(req.body, {
//             where: { id: req.params.id }
//           })
//             .then(num => {
//               if (num == 1) {
//                 res.send({
//                   message: "Stock was updated successfully."
//                 });
//               } else {
//                 res.send({
//                   message: `Cannot update Stock with id=${id}. Maybe Stock was not found or req.body is empty!`
//                 });
//               }
//             })
//       } catch (error) {
//         res.status(500).json({
//           status: "error",
//           message: error.message,
//         });
//       }
// })

module.exports = router;