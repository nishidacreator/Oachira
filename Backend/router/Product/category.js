const express = require('express');
const Category = require('../../models/Products/category');
const router = express.Router();
const multer = require('../../utils/multer')
const authenticateToken = require('../../middleware/authorization');
const {Op} = require('sequelize');

router.post('/', multer.single('category_image'), async (req, res) => {
    try {
            let category = {
              category_image : req.file?.path,
              categoryName : req.body.categoryName,
              taxable : req.body.taxable
            }

      const result = await Category.create(category);
      res.send(result);
  } catch (error) {
      console.error(error); // Log the error for debugging purposes
      res.status(500).send('An error occurred while processing the request.');
  }
});

router.get("/",authenticateToken, async (req, res) => {
  try {
    let whereClause = {};

    if (req.query.search) {
      whereClause = {
        [Op.or]: [
          { categoryName: { [Op.iLike]: `%${req.query.search}%` } }
        ],
      };
    }

    let limit;
    let offset;

    if (req.query.pageSize && req.query.page) {
      limit = req.query.pageSize;
      offset = (req.query.page - 1) * req.query.pageSize;
    }


    const categories = await Category.findAll({
      where: whereClause,
      order: ["id"],
      limit, 
      offset
    });
    

    // Add the image URL to each category
    const categoriesWithImageURLs = categories.map((category) => {
      if (category.category_image) {
        return {
          id: category.id,
          categoryName: category.categoryName,
          taxable: category.taxable,
          category_image: `${category.category_image}`,
        };
      } else {
        return {
          id: category.id,
          categoryName: category.categoryName,
          taxable: category.taxable,
          category_image: "",
        };
      }
    });



    let totalCount;

    if (req.query.search) {
      totalCount = await Category.count({
        where: whereClause,
      });
    } else {
      totalCount = await Category.count();
    }

    if (req.query.page && req.query.pageSize) {
      const response = {
        count: totalCount,
        items: categoriesWithImageURLs,
      };

      res.json(response);
    } else {
      res.send(categoriesWithImageURLs);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await Category.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Category with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
        res.send({error: error.message})
    }
    
})

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        Category.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Category was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Category with id=${id}. Maybe Category was not found or req.body is empty!`
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