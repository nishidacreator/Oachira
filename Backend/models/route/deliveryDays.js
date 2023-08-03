const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const DeliveryDays = sequelize.define('deliveryDays',{
    routeId : {type : DataTypes.INTEGER, allowNull : false},
    weekDay : {type : DataTypes.STRING, allowNull : false},
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = DeliveryDays;


