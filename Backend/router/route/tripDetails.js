const express = require('express');
const Route = require('../../models/route/route');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');
const Vehicle = require('../../models/route/vehicle');
const User = require('../../models/User/user');
const TripDetails = require('../../models/route/tripDetails');
const Trip = require('../../models/route/trip');
const Customer = require('../../models/Customer/customer');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {customers} = req.body;

            const result = await TripDetails.bulkCreate(customers)

            await result.save();

            res.send(result);

    } catch (error) {
        res.send(error);
    }
})

router.get('/:id', authenticateToken,async(req,res)=>{

    try {
        const route = await TripDetails.findAll({
          where: {tripId : req.params.id},
          include: [Trip, Customer]
        });
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