const express = require('express');
const bcrypt = require('bcrypt');
const Customer = require('../../models/Customer/customer');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');
const CustomerCategory = require('../../models/Customer/customerCategory');
const CustomerGrade = require('../../models/Customer/customerGrade');


router.post('/', async (req, res) => {
    try {
        const { customerName, customerCategoryId, phoneNumber, address, location, gstNo, email, remarks, customerGradeId, subledgerCode } = req.body;

        const customer = await Customer.findOne({where: {phoneNumber:phoneNumber}});
    if (customer) {
        return res.status(400).send({ message: 'Mobile Number already exists' })  
    }
    const newCustomer = new Customer({ customerName, customerCategoryId, phoneNumber, address, location, gstNo, email, remarks, customerGradeId, subledgerCode });
    await newCustomer.save();

    res.status(200).send({id: newCustomer.id, name:newCustomer.customerName, pohneNumber:newCustomer.phoneNumber});
    } catch (error) {
        res.send({error : error.message});
    }   
})

router.get('/', async(req,res)=>{
    try {
        const customer = await Customer.findAll({include : [CustomerCategory, CustomerGrade], order: ['id']});
        res.send(customer);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.get('/', async(req,res)=>{
  try {
      const customer = await Customer.findAll({include : [CustomerCategory, CustomerGrade]});
      res.send(customer);
      
  } catch (error) {
      res.send(error.message);
  }  
})

router.delete('/:id', async(req,res)=>{
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

router.patch('/:id', async(req,res)=>{
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
 