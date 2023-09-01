const express = require('express');
const Route = require('../../models/route/route');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');
const Vehicle = require('../../models/route/vehicle');
const User = require('../../models/User/user');
const CollectionDays = require('../../models/route/collectionDays');
const DeliveryDays = require('../../models/route/deliveryDays');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {routeName, vehicleId, driverId, salesManId, salesExecutiveId, deliveryDays, collectionDays} = req.body;

            const route = new Route({routeName, vehicleId, driverId, salesManId, salesExecutiveId});

            await route.save();

            // const routeId = route.id

            // const copy = collectionDays.weekDays.slice();
            // console.log(copy.length)

            // for(let i = 0; i < copy.length; i++) {           
                                 
            //   const weekDay = collectionDays.weekDays.pop()

            //   const result = new CollectionDays({routeId, weekDay})

            //   await result.save()  
              
            // }

            // const delivery = deliveryDays.weekDays.slice();

            // for(let i = 0; i < delivery.length; i++) {

            //   const weekDay = deliveryDays.weekDays.pop()

            //   const result = new DeliveryDays({routeId, weekDay})

            //   await result.save()
            // }

            res.status(200).send(result)

    } catch (error) {
        res.send(error);
    }
})

router.get('/', authenticateToken,async(req,res)=>{

    try {
        const route = await Route.findAll({include: ['driver', 'salesman', 'salesexecutive' , Vehicle ], order:['id']});
        res.send(route);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.get('/:id', authenticateToken,async(req,res)=>{

  try {
      const route = await Route.findOne({
        where: {id: req.params.id},
        include: ['driver', 'salesman', 'salesexecutive' , Vehicle ]});
      res.send(route);
      
  } catch (error) {
      res.send(error.message);
  }  
})


router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await Route.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Route with that ID not found",
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
                  message: "Route was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Route with id=${id}. Maybe Route was not found or req.body is empty!`
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