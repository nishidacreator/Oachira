const {Sequelize} = require('sequelize')


const sequelize = new Sequelize('oachira_db', 'oachira', 'oachira', {
    host: 'localhost',
    dialect: 'postgres' 
});

  
module.exports = sequelize