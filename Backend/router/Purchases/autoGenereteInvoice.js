const express = require('express');
const Auto = require('../../models/Purchases/autoGenerateInvoice');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {prefix, lastNumber, date, purchaseInvoice} = req.body;

            const res = new Auto({prefix, lastNumber, date, purchaseInvoice});

            await res.save();

            res.send(res);

    } catch (error) {
        res.send(error);
    }
})

router.get('/', authenticateToken, async(req,res)=>{

    try {
        const brand = await Auto.findAll({order:['id']});
        res.send(brand);
        
    } catch (error) {
        res.send(error.message);
    }  
})


router.delete('/:id', async(req,res)=>{
    try {

        const result = await Brand.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Brand with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
        res.send({error: error.message})
    }
    
})

router.patch('/:id', async(req,res)=>{
    try {
        Brand.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Brand was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Brand with id=${id}. Maybe Brand was not found or req.body is empty!`
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