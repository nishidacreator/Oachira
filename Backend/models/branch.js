const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Branch = sequelize.define('branch',{
    branchName : {type : DataTypes.STRING,  allowNull : false},
    address : {type : DataTypes.STRING},
    phone : {type : DataTypes.STRING},
    email : {type : DataTypes.STRING},
    // branchManagerId : {type : DataTypes.INTEGER, allowNull : false}
},
{
    freezeTableName: true,
    timestamps: false
})


module.exports = Branch;


