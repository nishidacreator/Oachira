const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const DailyCollection = sequelize.define('dailyCollection',{
    customerId : {type : DataTypes.INTEGER, allowNull : false},
    amount  : {type : DataTypes.FLOAT, allowNull : false},
    date : {type : DataTypes.DATEONLY, allowNull : false, defaultValue : new Date()},
    invoiceNo : {type : DataTypes.STRING},
    salesExecutiveId : {type : DataTypes.INTEGER, allowNull : false},
    paymentMode : {type : DataTypes.STRING, allowNull : false},
    remarks : {type : DataTypes.STRING},
    routeId : {type : DataTypes.INTEGER, allowNull : false}
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = DailyCollection;


