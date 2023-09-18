const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../../models/User/user');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');
const Role = require('../../models/User/role')
const Branch = require('../../models/branch')

// /**
//  * @swagger
//  * /api/users:
//  *   post:
//  *     summary: Create a new user
//  *     description: Creates a new user with the provided information.
//  *     parameters:
//  *       - in: body
//  *         name: user
//  *         description: The user object to be created.
//  *         required: true
//  *         schema:
//  *           type: object
//  *           properties:
//  *             name:
//  *               type: string
//  *             phoneNumber:
//  *               type: string
//  *             password:
//  *               type: string
//  *             roleId:
//  *               type: integer
//  *             status:
//  *               type: string
//  *             branchId:
//  *               type: integer
//  *       - in: query
//  *         name: isAdmin
//  *         description: An optional query parameter to set the user as an admin.
//  *         schema:
//  *           type: boolean
//  *     responses:
//  *       201:
//  *         description: User created successfully.
//  *       400:
//  *         description: Bad request. Invalid input.
//  *       500:
//  *         description: Internal server error.
//  */


router.post('/', async (req, res) => {
    try {
        const { name, phoneNumber, password, roleId, status, branchId } = req.body;
        const user = await User.findOne({where: {phoneNumber:phoneNumber}});
    if (user) {
        return res.status(400).send({ message: 'User already exists in this phone number' })  
    }
    const pass = await bcrypt.hash(password, 10);
    const newUser = new User({
        name : name, 
        phoneNumber : phoneNumber, 
        password : pass, 
        roleId : roleId, 
        status : status,
        branchId : branchId
    });
    await newUser.save();
    res.status(200).send({id:newUser.id, name:newUser.name, pohneNumber:newUser.phoneNumber});
    } catch (error) {
        res.send({error : error.message});
    }   
})

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get a list of users
 *     description: Returns a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *       500:
 *         description: Internal server error
 */
router.get('/', async(req,res)=>{
    try {
        const user = await User.findAll({include : [Role, Branch], order:['id']});
        res.send(user);
        
    } catch (error) {
        res.send(error.message);
    }  
})

/**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: Get a list of users
 *     description: Returns a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', async(req,res)=>{
    try {

        const result = await User.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "User with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
        res.send({error: error.message})
    }
    
})

/**
 * @swagger
 * /api/users:
 *   patch:
 *     summary: Get a list of users
 *     description: Returns a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', async(req,res)=>{
  const pass = await bcrypt.hash(req.body.password, 10);

    try {
        const user = {
          name : req.body.name,
          phoneNumber : req.body.phoneNumber,
          password : pass,
          roleId : req.body.roleId,
          status: req.body.status,
         
        }

        User.update(user, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "User was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
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
 