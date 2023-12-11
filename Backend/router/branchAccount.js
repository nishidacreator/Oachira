const express = require('express');
const router = express.Router();

const authenticateToken = require('../middleware/authorization');

const Branch = require('../models/branch');

const BranchAccount = require('../models/branchAccount');
const BankAccount = require('../models/bankAccount');

router.get('/branchid/:id', authenticateToken, async(req,res)=>{
    try {
        const branch = await BranchAccount.findAll({
            where: { branchId: req.params.id },
            include : [Branch, BankAccount], order: ['id']
        });
        res.send(branch);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.get('/', authenticateToken, async(req,res)=>{
    try {
        const branch = await BranchAccount.findAll({
            include : [Branch], order: ['id']
        });
        res.send(branch);
        
    } catch (error) {
        res.send(error.message);
    }  
})
module.exports = router;