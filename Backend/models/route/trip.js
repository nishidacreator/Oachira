const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Trip = sequelize.define('trip',{
    routeId : {type : DataTypes.INTEGER, allowNull : false},
    date  : {type : DataTypes.DATEONLY},
    driver : {type : DataTypes.STRING, allowNull : false},
    salesMan : {type : DataTypes.STRING, allowNull : false},
    status : {type : DataTypes.STRING, allowNull : false},
    branchId: {type : DataTypes.INTEGER, allowNull : false}
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = Trip;


