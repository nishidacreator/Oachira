const express = require('express');
const CustomerCategory = require('../../models/Customer/customerCategory');
const router = express.Router();


router.post('/', async (req, res) => {
    try {
            const { categoryName } = req.body;

            const customerCategory = new CustomerCategory({categoryName});

            await customerCategory.save();

            res.send(customerCategory);

    } catch (error) {
        res.send(error);
    }
})

router.get('/', async (req, res) => {

    const customerCategory = await CustomerCategory.findAll({})

    res.send(customerCategory);
})

router.delete('/:id', async(req,res)=>{
    try {

        const result = await CustomerCategory.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Category with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
        res.send({error: error.message})
    }
    
})

router.patch('/:id', async(req,res)=>{
    try {
        CustomerCategory.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Customer Category was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Customer Category with id=${id}. Maybe Customer Category was not found or req.body is empty!`
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