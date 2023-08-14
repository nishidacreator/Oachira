const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const PurchaseOrder = sequelize.define('purchaseOrder',{
    purchaseOrderNo : {type : DataTypes.STRING, allowNull : false},
    vendorId : {type : DataTypes.INTEGER, allowNull : false},
    userId : {type : DataTypes.INTEGER, allowNull : false},
    requestedPurchaseDate : {type : DataTypes.DATEONLY, defaultValue: new Date()}
},
{
    freezeTableName: true,
})

module.exports = PurchaseOrder;



