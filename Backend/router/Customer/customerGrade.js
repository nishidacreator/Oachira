const express = require('express');
const CustomerGrade = require('../../models/Customer/customerGrade');
const router = express.Router();


router.post('/', async (req, res) => {
    try {
            const { grade, gradeRemarks } = req.body;

            const customerGrade = new CustomerGrade({ grade, gradeRemarks});

            await customerGrade.save();

            res.send(customerGrade);

    } catch (error) {
        res.send(error);
    }
})

router.get('/', async (req, res) => {

    const customerGrade = await CustomerGrade.findAll({})

    res.send(customerGrade);
})

router.delete('/:id', async(req,res)=>{
    try {

        const result = await CustomerGrade.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Customer Grade with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
        res.send({error: error.message})
    }
    
})

router.patch('/:id', async(req,res)=>{
    try {
        CustomerGrade.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Customer Grade was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Customer Grade with id=${id}. Maybe Customer Grade was not found or req.body is empty!`
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