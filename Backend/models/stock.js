const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Stock = sequelize.define('stock',{
    productId : {type : DataTypes.INTEGER, allowNull : false},
    primaryUnitId : {type : DataTypes.INTEGER, allowNull : false},
    primaryQuantity : {type : DataTypes.INTEGER, allowNull : false},
    secondaryUnitId : {type : DataTypes.INTEGER, allowNull : false},
    secondaryQuantity : {type : DataTypes.INTEGER, allowNull : false},
    mrp : {type : DataTypes.FLOAT, allowNull : false},
    amount : {type : DataTypes.FLOAT, allowNull : false},
    landingCost : {type : DataTypes.FLOAT, allowNull : false},
    sellingPrice : {type : DataTypes.FLOAT, allowNull : false},
    hsnCode : {type : DataTypes.STRING, allowNull : false},
    cgst : {type : DataTypes.FLOAT},
    sgst : {type : DataTypes.FLOAT},
    igst : {type : DataTypes.FLOAT},
    discount : {type : DataTypes.FLOAT},
    discountShared : {type : DataTypes.FLOAT},
    profitMargin1 : {type : DataTypes.FLOAT},
    profitMargin2 : {type : DataTypes.FLOAT},
    batch : {type : DataTypes.INTEGER, defaultValue : 1}
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = Stock;


