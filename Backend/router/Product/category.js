const express = require('express');
const Category = require('../../models/Products/category');
const router = express.Router();
const multer = require('../../utils/multer')


router.post('/', multer.single('category_image'), async (req, res) => {
    try {
            let category = {
              category_image : req.file?.path,
              categoryName : req.body.categoryName,
              taxable : req.body.taxable
            }

            const result = await Category.create(category)

            res.send(result);

    } catch (error) {
        res.send(error.message);
    }
})


router.get('/', async(req,res)=>{
    try {
        const category = await Category.findAll({order:['id']});
        res.send(category);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.delete('/:id', async(req,res)=>{
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

router.patch('/:id', async(req,res)=>{
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