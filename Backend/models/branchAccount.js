const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const BranchAccount = sequelize.define('branchaccount',{
    branchId : {type : DataTypes.INTEGER, allowNull : false},
    bankAccountId : {type : DataTypes.INTEGER, allowNull : false}
},
{
    freezeTableName: true,
    timestamps: false
})


module.exports = BranchAccount;


