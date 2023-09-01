const express = require('express');
const BankAccount = require('../models/bankAccount');
const router = express.Router();
const authenticateToken = require('../middleware/authorization');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {accountNo, ifscCode, bankName, branchName, openingBalance} = req.body;

            const bankaccount = new BankAccount({accountNo, ifscCode, bankName, branchName, openingBalance});

            await bankaccount.save();

            res.send(bankaccount);

    } catch (error) {
        res.send(error);
    }
})

router.get('/', authenticateToken,async(req,res)=>{

    try {
        const bankaccount = await BankAccount.findAll({order:['id']});
        res.send(bankaccount);
        
    } catch (error) {
        res.send(error.message);
    }  
})


router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await BankAccount.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "BankAccount with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
        res.send({error: error.message})
    }
    
})

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        BankAccount.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "BankAccount was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update BankAccount with id=${id}. Maybe BankAccount was not found or req.body is empty!`
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