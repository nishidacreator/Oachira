const express = require('express');
const Vendor = require('../models/vendor');
const router = express.Router();
const authenticateToken = require('../middleware/authorization');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {vendorName, address1, address2, state, vendorPhoneNumber, gstNo} = req.body;

            const vendor = new Vendor({vendorName, address1, address2, state, vendorPhoneNumber, gstNo});

            await vendor.save();

            res.send(vendor);

    } catch (error) {
        res.send(error);
    }
})

router.get('/', authenticateToken, async(req,res)=>{

    try {
        const vendor = await Vendor.findAll({order:['id']});
        res.send(vendor);
        
    } catch (error) {
        res.send(error.message);
    }  
})


router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await Vendor.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Vendor with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
        res.send({error: error.message})
    }
    
})

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        Vendor.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Vendor was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Vendor with id=${id}. Maybe Vendor was not found or req.body is empty!`
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