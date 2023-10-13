const {Sequelize} = require('sequelize')


const sequelize = new Sequelize('oachira1', 'oachira', 'oachira', {
    host: 'localhost',
    dialect: 'postgres' 
});

  
module.exports = sequelize