const express = require('express');
const Brand = require('../../models/Products/brand');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');

router.post('/', async (req, res) => {
    try {
            const {brandName} = req.body;

            const brand = new Brand({brandName});

            await brand.save();

            res.send(brand);

    } catch (error) {
        res.send(error);
    }
})

router.get('/', authenticateToken,async(req,res)=>{

    try {
        const brand = await Brand.findAll({order:['id']});
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