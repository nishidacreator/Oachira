const express = require('express');
const PurchaseEntry = require('../../models/Purchases/purchaseEntry');
const router = express.Router();
const Vendor = require('../../models/vendor')
const authorization = require('../../middleware/authorization');
const User = require('../../models/User/user');
const PurchaseEntryDetails = require('../../models/Purchases/purchaseEntryDetails');
const Transaction = require('../../models/transaction');


router.post('/', async (req, res) => {
    try {
            const {purchaseInvoice, vendorId, purchaseAmount, userId, eWayBillNo, purchaseEntryDetails, purachseDate} = req.body;

            const purchaseEntry = new PurchaseEntry({purchaseInvoice, vendorId, purchaseAmount, userId, eWayBillNo, purchaseEntryDetails, purachseDate});

            await purchaseEntry.save();

            const purchaseEntryId = purchaseEntry.id

            for(i=0; i<purchaseEntryDetails.length; i++){
                purchaseEntryDetails[i].purchaseEntryId = purchaseEntryId
            }

                // //ADD TO TRANSACTION TABLE
                // const transaction = await Transaction.findOne({ productId: purchaseEntryDetails[i].productId });

                // if (!transaction) {
                //     console.log("Transaction not found")
                //     // If the transaction does not exist, create a new one
                //     transaction = new Transaction({
                //         productId: purchaseEntryDetails[i].productId,
                //         quantity: purchaseEntryDetails[i].stockIn
                //     });

                //     await transaction.save();
                //     res.send(transaction)
                // } else {
                //     // If the transaction exists, update the quantity by adding the stockIn value
                //     console.log("Transaction updated")
                //     console.log(transaction+"hiiiii")
                //     // transaction.quantity += purchaseEntryDetails[i].stockIn;
                // }

                // Save the transaction to the database
               

            const pEntryDetails = await PurchaseEntryDetails.bulkCreate(purchaseEntryDetails)

            res.send(pEntryDetails);

    } catch (error) {
        res.send(error);
    }
})

router.get('/', async(req,res)=>{

    try {
        const purchaseEntry = await PurchaseEntry.findAll({include : [Vendor, User], order:['id']});
        res.send(purchaseEntry);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.get('/:id', async(req,res)=>{

    try {
        const purchaseEntry = await PurchaseEntry.findOne({
            where: { id: req.params.id},
            include : [Vendor, User], 
            order:['id']});
        res.send(purchaseEntry);
        
    } catch (error) {
        res.send(error.message);
    }  
})


// router.delete('/:id', async(req,res)=>{
//     try {

//         const result = await PurchaseEntry.destroy({
//             where: { id: req.params.id },
//             force: true,
//         });

//         if (result === 0) {
//             return res.status(404).json({
//               status: "fail",
//               message: "Purchase Entry with that ID not found",
//             });
//           }
      
//           res.status(204).json();
//         }  catch (error) {
//         res.send({error: error.message})
//     }
    
// })

router.patch('/:id', async(req,res)=>{
    try {
        PurchaseEntry.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Purchase Entry was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Purchase Entry with id=${id}. Maybe Purchase Entry was not found or req.body is empty!`
                });
              }
            })
      } catch (error) {
        res.status(500).json({
          status: "error",
          message: error.message,
        });
      }
})

router.patch('/amount/:id', async(req,res)=>{
    try {
        const update = {
            purchaseAmount : req.body.purchaseAmount
        }
               
        PurchaseEntry.update(update, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Purchase Entry was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Purchase Entry with id=${id}. Maybe Purchase Entry was not found or req.body is empty!`
                });
              }
            })
      } catch (error) {
        res.status(500).json({
          status: "error",
          message: error.message,
        });
      }
})

module.exports = router;