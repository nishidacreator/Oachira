const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Customer = sequelize.define('customer',{
    customerName : {type: DataTypes.STRING, allowNull : false},
    customerCategoryId : {type: DataTypes.INTEGER, allowNull : false},
    customerGradeId : {type: DataTypes.INTEGER, allowNull : false},
    address : {type: DataTypes.STRING},
    location : {type: DataTypes.STRING},
    gstNo : {type: DataTypes.STRING},
    email : {type: DataTypes.STRING, unique : true},
    remarks : {type: DataTypes.STRING},
    subledgerCode : {type: DataTypes.STRING},
    branchId: {type: DataTypes.INTEGER, allowNull : true},
},
{
    freezeTableName: true,
})

module.exports = Customer