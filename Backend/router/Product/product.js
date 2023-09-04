const express = require('express');
const Product = require('../../models/Products/product');
const router = express.Router();
const PrimaryUnit = require('../../models/Products/primayUnit');
const Category = require('../../models/Products/category');
const Brand = require('../../models/Products/brand');
const {Op} = require('sequelize');
const multer = require('../../utils/multer');
const cloudinary = require('../../utils/cloudinary');


router.post("/", multer.single("category_image"), async (req, res) => {
  try {
    let product = {
      productName: req.body.productName,
      code: req.body.code,
      barCode: req.body.barCode,
      primaryUnitId: req.body.primaryUnitId,
      categoryId: req.body.categoryId,
      brandId: req.body.brandId,
      reorderQuantity: req.body.reorderQuantity,
      loyaltyPoint: req.body.loyaltyPoint,
      product_image: req.file?.path,
    };
    if (req.file) {
      const image = await cloudinary.uploader.upload(req.file.path, {
        public_id: product.productName,
      });
      product.product_image = image.secure_url;
    }

    const result = await Product.create(product);
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

router.get('/', async(req,res)=>{
  try {
      const product = await Product.findAll({include: [PrimaryUnit, Category, Brand], order:['id']});
      res.send(product);
      
  } catch (error) {
      res.send(error.message);
  }  
})

router.get('/filter', async(req,res)=>{
    try {
        let {search} = req.body

        const product = await Product.findAll({where: {[Op.or]:[{productName: search}, {code: search}, {barCode: search}]},include: [PrimaryUnit, Category, Brand]});
        res.send(product);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.delete('/:id', async(req,res)=>{
    try {

        const result = await Product.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Product with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
        res.send({error: error.message})
    }
    
})

router.patch('/:id', async(req,res)=>{
    try {
        Product.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Product was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`
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