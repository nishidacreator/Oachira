const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const PurchaseTransaction = sequelize.define('purchaseTransaction',{
   stockId: {type: DataTypes.INTEGER, allowNull: false},
   purchaseEntryId: {type: DataTypes.INTEGER, allowNull: false}
},
{
    freezeTableName: true,
    timestamps: false
})


module.exports = PurchaseTransaction;


