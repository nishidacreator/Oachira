const express = require('express');
const DeliveryDays = require('../../models/route/deliveryDays');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');
const Route = require('../../models/route/route');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {routeId, weekDays} = req.body;

            const weekDaysCopy = weekDays.slice();
            for(i = 0; i < weekDaysCopy.length; i++) {
                
                const weekDay = weekDays.pop()

                const result = new DeliveryDays({routeId, weekDay})

                await result.save()
 
            }

            res.status(200).json({message: "Success"})
            
    } catch (error) {
        res.send(error);
    }
})

router.get('/', authenticateToken, async(req,res)=>{

    try {
        const result = await DeliveryDays.findAll({include : Route, order:['id']});
        res.send(result);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.get('/byrouteid/:id', authenticateToken, async(req,res)=>{

  try {
      const result = await DeliveryDays.findAll({
        where: { routeId : req.params.id},
        include : Route,
        order:['id']
      });
      res.send(result);
      
  } catch (error) {
      res.send(error.message);
  }  
})



router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await DeliveryDays.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "DeliveryDays with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
        res.send({error: error.message})
    }
    
})

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
      DeliveryDays.update(req.body, {where: { id: req.params.id }})
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "DeliveryDays was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update DeliveryDays with id=${id}. Maybe DeliveryDays was not found or req.body is empty!`
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