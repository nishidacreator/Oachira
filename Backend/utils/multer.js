const multer = require('multer');
const path = require('path');

  module.exports = multer({
    storage : multer.diskStorage({
        destination : (req, file, cb)=>{
          cb(null, path.join(__dirname, '../images'))
        },

        filename: (req, file, cb)=>{
          cb(null, Date.now() + path.extname(file.originalname))
        }
      }),

    limits : {fileSize : '1000000'},
    
    fileFilter : (req,file,cb)=>{
      const fileTypes = /jpeg|jpg|png|gif/
      const mimetype = fileTypes.test(file.mimetype)
      const extname = fileTypes.test(path.extname(file.originalname))
  
      if(mimetype && extname){
        return cb(null, true)
      }
      cb('File format is not supported')
    }
  })
  