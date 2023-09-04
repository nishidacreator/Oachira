const express = require('express');
const RouteDetails = require('../../models/route/routeDetails');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');
const Route = require('../../models/route/route');
const Customer = require('../../models/Customer/customer');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {routeId, customerId, routeIndex} = req.body;

            const routeDetails = new RouteDetails({routeId, customerId, routeIndex})
            await routeDetails.save();

            res.send(routeDetails);

    } catch (error) {
        res.send(error);
    }
})

router.get('/', authenticateToken, authenticateToken,async(req,res)=>{

    try {
        const routeDetails = await RouteDetails.findAll({include: [Route, Customer], order:['id']});
        res.send(routeDetails);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.get('/byrouteid/:id', authenticateToken, async(req,res)=>{

  try {
      const routeDetails = await RouteDetails.findAll({
        where: {routeId: req.params.id},
        include: [Route, Customer]});
      res.send(routeDetails);
      
  } catch (error) {
      res.send(error.message);
  }  
})


router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await RouteDetails.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "RouteDetails with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
        res.send({error: error.message})
    }
    
})

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        RouteDetails.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "RouteDetails was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update RouteDetails with id=${id}. Maybe RouteDetails was not found or req.body is empty!`
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