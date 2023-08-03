const express = require('express');
const PurchaseEntryDetails = require('../../models/Purchases/purchaseEntryDetails');
const router = express.Router();
const authorization = require('../../middleware/authorization');
const PurchaseEntry = require('../../models/Purchases/purchaseEntry');
const Product = require('../../models/Products/product');
const SecondaryUnit = require('../../models/Products/secondaryUnit');
const Stock = require('../../models/stock');
const PrimaryUnit = require('../../models/Products/primayUnit')
const Tax = require('../../models/Products/tax')

router.post('/', async (req, res) => {
    try {
            const {products} = req.body;
            
            console.log(products)

            const purchaseEntryDetails = await PurchaseEntryDetails.bulkCreate(products)

            await purchaseEntryDetails.save();
          
            res.send(purchaseEntryDetails);

    } catch (error) {
        res.send(error.message);
    }
})

router.get('/:id', async(req,res)=>{

    try {
        const purchaseEntryDetails = await PurchaseEntryDetails.findAll({
            where:{purchaseEntryId: req.params.id}, 
            include : [PurchaseEntry, Product, SecondaryUnit, Tax], order:['id']});
        res.send(purchaseEntryDetails);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.get('/', async(req,res)=>{

    try {
        const purchaseEntryDetails = await PurchaseEntryDetails.findAll({include : [PurchaseEntry, Product, SecondaryUnit, Tax], order:['id']});
        res.send(purchaseEntryDetails);
        
    } catch (error) {
        res.send(error.message);
    }  
})


// router.delete('/:id', async(req,res)=>{
//     try {

//         const result = await PurchaseEntryDetails.destroy({
//             where: { id: req.params.id },
//             force: true,
//         });

//         if (result === 0) {
//             return res.status(404).json({
//               status: "fail",
//               message: "PurchaseEntryDetails with that ID not found",
//             });
//           }
      
//           res.status(204).json();
//         }  catch (error) {
//         res.send({error: error.message})
//     }
    
// })

// router.patch('/:id', async(req,res)=>{
//     try {
//         PurchaseEntryDetails.update(req.body, {
//             where: { id: req.params.id }
//           })
//             .then(num => {
//               if (num == 1) {
//                 res.send({
//                   message: "PurchaseEntryDetails was updated successfully."
//                 });
//               } else {
//                 res.send({
//                   message: `Cannot update PurchaseEntryDetails with id=${id}. Maybe PurchaseEntryDetails was not found or req.body is empty!`
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