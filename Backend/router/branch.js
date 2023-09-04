const express = require('express');
const Branch = require('../models/branch');
const router = express.Router();
const authenticateToken = require('../middleware/authorization');
const BranchAccount = require('../models/branchAccount');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {branchName, address, branchManagerId, branchAccounts} = req.body;

            const branch = new Branch({branchName, address, branchManagerId});
           
            await branch.save();
            console.log(branch)

            const branchId = branch.id;
            console.log(branchId)

            for(let i=0; i<branchAccounts.length; i++) {
              branchAccounts[i].branchId = branchId;
            }
            console.log(branchAccounts)

            const bAccount = await BranchAccount.bulkCreate(branchAccounts)

            res.send(bAccount);

    } catch (error) {
        res.send(error);
    }
})

router.get('/', authenticateToken, async(req,res)=>{

    try {
        const branch = await Branch.findAll({order:['id']});
        res.send(branch);
        
    } catch (error) {
        res.send(error.message);
    }  
})


router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await Branch.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Branch with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
        res.send({error: error.message})
    }
    
})

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        Branch.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Branch was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Branch with id=${id}. Maybe Branch was not found or req.body is empty!`
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