const express = require('express');
const router = express.Router();

const authenticateToken = require('../../middleware/authorization');
const bcrypt = require('bcrypt');

const Customer = require('../../models/Customer/customer');
const CustomerCategory = require('../../models/Customer/customerCategory');
const CustomerGrade = require('../../models/Customer/customerGrade');
const CustomerPhone = require('../../models/Customer/customerPhone');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const data = req.body;

        const { customerName, customerCategoryId, address, location, gstNo, email, remarks, customerGradeId, subledgerCode, numbers } = data;

        const newCustomer = await Customer.create( {customerName, customerCategoryId, address, location, gstNo, email, remarks, customerGradeId, subledgerCode} );

        const custId = newCustomer.id

        for(let i = 0; i < numbers.length; i++){
          numbers[i].customerId = custId;
        }

        let custPhone = await CustomerPhone.bulkCreate(numbers)

        res.status(200).send(custPhone);
    } catch (error) {
        res.send({error : error.message});
    }   
})

router.get('/', authenticateToken, async(req,res)=>{
    try {
        const customer = await Customer.findAll({include : [CustomerCategory, CustomerGrade], order: ['id']});
        res.send(customer);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.get('/:id', authenticateToken, async(req,res)=>{
  try {
      const customer = await Customer.findOne({
        where : {id: req.params.id},
        include : [CustomerCategory, CustomerGrade]
        });
      res.send(customer);
      
  } catch (error) {
      res.send(error.message);
  }  
})

router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await Customer.destroy({
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

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        Customer.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Customer was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Customer with id=${id}. Maybe Customer was not found or req.body is empty!`
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
 