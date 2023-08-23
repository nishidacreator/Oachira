const {Sequelize} = require('sequelize')


const sequelize = new Sequelize('oachira', 'oachira', 'oachira', {
    host: 'localhost',
    dialect: 'postgres' 
});

  
module.exports = sequelize