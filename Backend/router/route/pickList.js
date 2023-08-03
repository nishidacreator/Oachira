const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');
const PickList = require('../../models/route/pickList');
const Route = require('../../models/route/route');
const Customer = require('../../models/Customer/customer');
const PickListDetails = require('../../models/route/pickListDetails');
const User = require('../../models/User/user');

router.post('/', async (req, res) => {
    try {
            const {routeId, customerId, date, status, pickListDetails, salesExecutiveId, deliveryDate} = req.body;

            const result = new PickList({routeId, customerId, date, status, pickListDetails, salesExecutiveId, deliveryDate});

            await result.save();
            
            const pickId = result.id;

            for(i = 0; i< pickListDetails.length; i++) {
              pickListDetails[i].pickListId = pickId
            }

            const finalResult = await PickListDetails.bulkCreate(pickListDetails)

            res.send(result);

    } catch (error) {
        res.send(error);
    }
})

router.get('/',async(req,res)=>{

    try {
        const result = await PickList.findAll({include: [Route, Customer, 'salesexecutive'], order:['id']});
        res.send(result);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.get('/routeid/:id',async(req,res)=>{

  try {
      const result = await PickList.findAll({
        where: {routeId: req.params.id},
        include: [Route, Customer, 'salesexecutive']});
      res.send(result);
      
  } catch (error) {
      res.send(error.message);
  }  
})

router.get('/:id',async(req,res)=>{

  try {
      const result = await PickList.findOne(
        {where : {id: req.params.id},
        include: [
          {
            model: Route
          },
          {
            model: Customer
          },
          {
            model: User,
            as: 'salesexecutive'
          }           
        ]}
        );
      res.send(result);
      
  } catch (error) {
      res.send(error.message);
  }  
})

router.delete('/:id', async(req,res)=>{
    try {

        const result = await PickList.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Pick List with that ID not found",
            });
          }    
          res.status(204).json();
        }  catch (error) {
        res.send({error: error.message})
    }
    
})

router.patch('/:id', async(req,res)=>{
    try {
        Route.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Pick List was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Pick List with id=${id}. Maybe Pick List was not found or req.body is empty!`
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