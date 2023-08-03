const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Brand = sequelize.define('brand',{
    prefix : {type : DataTypes.STRING, allowNull : false},
    lastNumber : {type : DataTypes.STRING, allowNull : false},
    date : {type : DataTypes.DATE, allowNull : false},
    purchaseInvoice : {type : DataTypes.STRING, allowNull : false},
},
{
    freezeTableName: true,
    timestamps: false
})


module.exports = Brand;


