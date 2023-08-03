const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Transaction = sequelize.define('transaction',{
    stockId : {type : DataTypes.INTEGER},
    stockIn : {type : DataTypes.FLOAT},
    stockOut : {type : DataTypes.FLOAT},
    financialYearId : {type : DataTypes.INTEGER},
    customerId : {type : DataTypes.INTEGER},
    productId : {type : DataTypes.INTEGER, allowNull : false}
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = Transaction;



