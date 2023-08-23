const express = require('express');
const VehicleType = require('../../models/route/vehicleType');
const router = express.Router();


router.post('/', async (req, res) => {
    try {
            const { typeName } = req.body;

            const vehicletype = new VehicleType({typeName});

            await vehicletype.save();

            res.send(vehicletype);

    } catch (error) {
        res.send(error);
    }
})

router.get('/', async (req, res) => {

    const vehicletype = await VehicleType.findAll({})

    res.send(vehicletype);
})

router.get('/:id', async (req, res) => {

  const vehicletype = await VehicleType.findOne({where: {id: req.params.id}})

  res.send(vehicletype);
})

router.delete('/:id', async(req,res)=>{
    try {

        const result = await VehicleType.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "VehicleType with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
        res.send({error: error.message})
    }
    
})

router.patch('/:id', async(req,res)=>{
    try {
        VehicleType.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "VehicleType was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update VehicleType with id=${id}. Maybe VehicleType was not found or req.body is empty!`
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