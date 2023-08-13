const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const SalesTransaction = sequelize.define('salesTransaction',{
    stockId: {type: DataTypes.INTEGER, allowNull: false},
    salesEntryId: {type: DataTypes.INTEGER, allowNull: false}
},
{
    freezeTableName: true,
    timestamps: false
})


module.exports = SalesTransaction;


