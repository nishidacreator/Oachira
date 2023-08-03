const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const PurchaseEntryDetails = sequelize.define('purchaseEntryDetails',{
    purchaseEntryId : {type : DataTypes.INTEGER},  
    productId : {type : DataTypes.INTEGER, allowNull : false},
    quantity : {type : DataTypes.INTEGER, allowNull : false},
    discount : {type : DataTypes.FLOAT},
    rate : {type : DataTypes.FLOAT, allowNull : false},
    grossAmount : {type : DataTypes.FLOAT},
    // secondaryUnitId : {type : DataTypes.INTEGER, allowNull : false},
    taxId : {type : DataTypes.INTEGER},
    taxAmount : {type : DataTypes.FLOAT},
    netAmount : {type : DataTypes.FLOAT, allowNull : false},
    mrp : {type : DataTypes.FLOAT}
    },
    {
        freezeTableName: true,
    })

module.exports = PurchaseEntryDetails;


