const express = require('express');
const PurchaseOrder = require('../../models/Purchases/purchaseOrder');
const router = express.Router();
const Vendor = require('../../models/vendor')
const User = require('../../models/User/user');
const PurchaseOrderDetails = require('../../models/Purchases/purchaseOrderDetails');


router.post('/', async (req, res) => {
    try {
            const {purchaseOrderNo, vendorId, userId,  purchaseOrderDetails, requestedPurchaseDate} = req.body;

            const purchaseOrder = new PurchaseOrder({purchaseOrderNo, vendorId,  userId,  requestedPurchaseDate});

            await purchaseOrder.save();

            const purchaseOrderId = purchaseOrder.id

            for(i=0; i<purchaseOrderDetails.length; i++){
                purchaseOrderDetails[i].purchaseOrderId = purchaseOrderId
            }
            const pOrderDetails = await PurchaseOrderDetails.bulkCreate(purchaseOrderDetails)
            res.send(pOrderDetails);

    } catch (error) {
        res.send(error);
    }
})

router.get('/', async(req,res)=>{

    try {
        const purchaseOrder = await PurchaseOrder.findAll({include : [Vendor, User], order:['id']});
        res.send(purchaseOrder);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.get('/:id', async(req,res)=>{

    try {
        const purchaseOrder = await PurchaseOrder.findOne({
            where: { id: req.params.id},
            include : [Vendor, User], 
            order:['id']});
        res.send(purchaseOrder);
        
    } catch (error) {
        res.send(error.message);
    }  
})



router.patch('/:id', async(req,res)=>{
    try {
        PurchaseOrder.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Purchase Order was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Purchase Order with id=${id}. Maybe Purchase Order was not found or req.body is empty!`
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