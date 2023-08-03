const express = require('express');
const Vehicle = require('../../models/route/vehicle');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');

router.post('/', async (req, res) => {
    try {
            const {registrationNumber, vehicleType, taxExpiry, insuranceExpiry, polutionExpiry, capacity} = req.body;

            const vehicle = new Vehicle({registrationNumber, vehicleType, taxExpiry, insuranceExpiry, polutionExpiry, capacity});

            await vehicle.save();

            res.send(vehicle);

    } catch (error) {
        res.send(error);
    }
})

router.get('/', async(req,res)=>{

    try {
        const vehicle = await Vehicle.findAll({});
        res.send(vehicle);
    } catch (error) {
        res.send(error.message);
    }  
})


router.delete('/:id', async(req,res)=>{
    try {

        const result = await Vehicle.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Vehicle with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
        res.send({error: error.message})
    }
    
})

router.patch('/:id', async(req,res)=>{
    try {
        Vehicle.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Vehicle was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Vehicle with id=${id}. Maybe Vehicle was not found or req.body is empty!`
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