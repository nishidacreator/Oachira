const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');
const DailyCollection = require('../../models/route/dailyCollection');
const Route = require('../../models/route/route');
const User = require('../../models/User/user');
const Customer = require('../../models/Customer/customer');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {customerId, amount, date, invoiceNo, salesExecutiveId, paymentMode, remarks, routeId} = req.body;

            const result = new DailyCollection({customerId, amount, date, invoiceNo, salesExecutiveId, paymentMode, remarks, routeId});

            await result.save();

            res.send(result);

    } catch (error) {
        res.send(error);
    }
})

router.get('/', authenticateToken,async(req,res)=>{

    try {
        const result = await DailyCollection.findAll({include: [Customer, 'salesexecutive', Route], order:['id']});
        res.send(result);
        
    } catch (error) {
        res.send(error.message);
    }  
})


router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await DailyCollection.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "DailyCollection with that ID not found",
            });
          }    
          res.status(204).json();
        }  catch (error) {
        res.send({error: error.message})
    }
    
})

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        Route.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "DailyCollection was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update DailyCollection with id=${id}. Maybe DailyCollection was not found or req.body is empty!`
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