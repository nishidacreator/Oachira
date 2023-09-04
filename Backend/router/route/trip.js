const express = require('express');
const Trip = require('../../models/route/trip');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');
const Route = require('../../models/route/route');
const TripDetails = require('../../models/route/tripDetails');
const User = require('../../models/User/user');  

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {routeId, date, driver, salesMan, status, tripDetails} = req.body;

            const result = new Trip({routeId, date, driver, salesMan, status});

            await result.save();

            const tripId = result.id

            for(let i = 0; i < tripDetails.length; i++) {
                tripDetails[i].tripId = tripId
            }

            tDetails = await TripDetails.bulkCreate(tripDetails)

            res.send(result);

    } catch (error) {
        res.send(error);
    }
})

router.get('/', authenticateToken,async(req,res)=>{
    try {
        const route = await Trip.findAll({include: Route});
        res.send(route);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.get('/:id', authenticateToken,async(req,res)=>{
  try {
      const result = await Trip.findOne(
        {where: {id: req.params.id},
        include: Route});
      res.send(result);
      
  } catch (error) {
      res.send(error.message);
  }  
})




router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await Trip.destroy({
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
        Trip.update(req.body, {
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