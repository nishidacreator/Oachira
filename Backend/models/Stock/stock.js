const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Stock = sequelize.define('stock',{
    type : {type : DataTypes.BOOLEAN, allowNull : false},
    productId : {type : DataTypes.INTEGER, allowNull : false},
    quantity : {type : DataTypes.FLOAT, allowNull : false},
    rate : {type : DataTypes.FLOAT, allowNull : false},
    mrp : {type : DataTypes.FLOAT},
    netAmount : {type : DataTypes.FLOAT}
},
{
    freezeTableName: true,
    timestamps: false
})


module.exports = Stock;


