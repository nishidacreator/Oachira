const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const BankAccount = sequelize.define('bankAccount',{
    accountType : {type : DataTypes.STRING, allowNull : false},
    accountNo : {type : DataTypes.STRING, allowNull : false},
    ifscCode : {type : DataTypes.STRING, allowNull : false},
    bankName : {type : DataTypes.STRING, allowNull : false},
    branchName : {type : DataTypes.STRING, allowNull : false},
    openingBalance : {type : DataTypes.FLOAT, allowNull : false}
},
{
    freezeTableName: true,
    timestamps: false
})


module.exports = BankAccount;


