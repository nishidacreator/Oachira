const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const PurchaseOrderDetails = sequelize.define('purchaseOrderDetails',{
    purchaseOrderId : {type : DataTypes.INTEGER},  
    productId : {type : DataTypes.INTEGER, allowNull : false},
    quantity : {type : DataTypes.INTEGER, allowNull : false},
    },
    {
        freezeTableName: true,
    })

module.exports = PurchaseOrderDetails;


