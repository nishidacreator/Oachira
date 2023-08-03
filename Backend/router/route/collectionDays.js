const express = require('express');
const CollectionDays = require('../../models/route/collectionDays');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');
const Route = require('../../models/route/route');

router.post('/', async (req, res) => {
    try {
            const {routeId, weekDays} = req.body;



            const weekDaysCopy = weekDays.slice();
            for(i = 0; i < weekDaysCopy.length; i++) {
                
                const weekDay = weekDays.pop()

                const result = new CollectionDays({routeId, weekDay})

                await result.save()
 
            }

            res.status(200).json({message: "Success"})
            
    } catch (error) {
        res.send(error);
    }
})

router.get('/', authenticateToken,async(req,res)=>{

    try {
        const result = await CollectionDays.findAll({include : Route, order:['id']});
        res.send(result);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.get('/:id', authenticateToken,async(req,res)=>{

  try {
      const result = await CollectionDays.findAll({
        where: {routeId: req.params.id},
        include : Route});
      res.send(result);
      
  } catch (error) {
      res.send(error.message);
  }  
})

router.delete('/:id', async(req,res)=>{
    try {

        const result = await CollectionDays.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "CollectionDays with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
        res.send({error: error.message})
    }
    
})

router.patch('/:id', async(req,res)=>{
    try {
      CollectionDays.update(req.body, {where: { id: req.params.id }})
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "CollectionDays was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update CollectionDays with id=${id}. Maybe CollectionDays was not found or req.body is empty!`
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