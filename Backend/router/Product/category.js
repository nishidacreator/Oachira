const express = require('express');
const Category = require('../../models/Products/category');
const router = express.Router();
const multer = require('../../utils/multer');
const cloudinary = require('../../utils/cloudinary');


router.post('/', multer.single('category_image'), async (req, res) => {
  try {
      let category = {
          categoryName: req.body.categoryName,
          taxable: req.body.taxable,
          category_image: req.file?.path,
      };

      if (req.file) {
          const image = await cloudinary.uploader.upload(
              req.file.path,
              { public_id: category.categoryName }
          );
          category.category_image = image.secure_url;
      }

      const result = await Category.create(category);
      res.send(result);
  } catch (error) {
      console.error(error); // Log the error for debugging purposes
      res.status(500).send('An error occurred while processing the request.');
  }
});

router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll({ order: ["id"] });

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

    res.json(categoriesWithImageURLs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/:path(*)', (req, res) => {
  try {
  //   const imagePath = path.join(req.params.path);
  //   console.log(imagePath)
  // console.log(path)
    // Construct an absolute path to the image file
    const absoluteImagePath = path.resolve(req.params.path);
    console.log(absoluteImagePath)
    res.sendFile(absoluteImagePath);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


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