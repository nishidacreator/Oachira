const express = require('express');
const Product = require('../../models/Products/product');
const router = express.Router();
const PrimaryUnit = require('../../models/Products/primayUnit');
const Category = require('../../models/Products/category');
const Brand = require('../../models/Products/brand');
const {Op} = require('sequelize');
const multer = require('../../utils/multer');
const cloudinary = require('../../utils/cloudinary');
const authenticateToken = require('../../middleware/authorization');


router.post('/', async (req, res) => {
    try {
            const { productName, code, barCode, primaryUnitId, categoryId, brandId, reorderQuantity, loyaltyPoint} = req.body;

    const result = await Product.create(product);
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [PrimaryUnit, Category, Brand],
      order: ['id'],
      limit: req.query.pageSize || 10, // Use the requested page size or a default value
      offset: (req.query.page - 1) * (req.query.pageSize || 10), // Calculate the offset based on the page number
    });

    const totalCount = await Product.count(); // Get the total count of products

    const response = {
      count: totalCount,
      items: products,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/filter', async(req,res)=>{
    try {
        let {search} = req.body

        const product = await Product.findAll({where: {[Op.or]:[{productName: search}, {code: search}, {barCode: search}]},include: [PrimaryUnit, Category, Brand]});
        res.send(product);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.delete('/:id', authenticateToken, async(req,res)=>{
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

router.patch('/:id', authenticateToken, async(req,res)=>{
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