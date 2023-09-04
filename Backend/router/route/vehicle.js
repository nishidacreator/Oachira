const express = require('express');
const Vehicle = require('../../models/route/vehicle');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');
const VehicleType = require('../../models/route/vehicleType');
const multer = require('../../utils/multer');
const cloudinary = require('../../utils/cloudinary');    

router.post("/", multer.single("category_image"), authenticateToken, async (req, res) => {
  try {
    let vehicle = {
      registrationNumber: req.body.registrationNumber,
      vehicleTypeId: req.body.vehicleTypeId,
      taxExpiry: req.body.taxExpiry,
      insuranceExpiry: req.body.insuranceExpiry,
      polutionExpiry: req.body.polutionExpiry,
      capacity: req.body.capacity,
      permitExpiry: req.body.permitExpiry,
      fitnessExpiry: req.body.fitnessExpiry,
      vehicle_image: req.file?.path,
    };
    if (req.file) {
      const image = await cloudinary.uploader.upload(req.file.path, {
        public_id: vehicle.registrationNumber,
      });
      vehicle.vehicle_image = image.secure_url;
    }
    const result = await Vehicle.create(vehicle);
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

router.get('/', authenticateToken, async(req,res)=>{

    try {
        const vehicle = await Vehicle.findAll({include: [VehicleType]});
        res.send(vehicle);
    } catch (error) {
        res.send(error.message);
    }  
})


router.delete('/:id', authenticateToken, async(req,res)=>{
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

router.patch('/:id', authenticateToken, async(req,res)=>{
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