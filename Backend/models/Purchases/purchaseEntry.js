const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const PurchaseEntry = sequelize.define('purchaseEntry',{
    purchaseInvoice : {type : DataTypes.STRING, allowNull : false},
    vendorId : {type : DataTypes.INTEGER, allowNull : false},
    purchaseAmount : {type : DataTypes.FLOAT, allowNull : false},
    userId : {type : DataTypes.INTEGER, allowNull : false},
    purchaseOrderId : {type : DataTypes.INTEGER, allowNull : true},
    eWayBillNo : {type : DataTypes.STRING},
    purachseDate : {type : DataTypes.DATEONLY, defaultValue: new Date()},
    branchId: {type : DataTypes.INTEGER}
},
{
    freezeTableName: true,
})

module.exports = PurchaseEntry;


