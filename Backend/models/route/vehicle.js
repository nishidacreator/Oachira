const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Vehicle = sequelize.define('vehicle',{
    registrationNumber : {type : DataTypes.STRING, allowNull : false},
    vehicleType : {type : DataTypes.STRING, allowNull : false},
    taxExpiry : {type : DataTypes.DATEONLY, allowNull : false},
    insuranceExpiry : {type : DataTypes.DATEONLY, allowNull : false},
    polutionExpiry : {type : DataTypes.DATEONLY, allowNull : false},
    capacity : {type : DataTypes.STRING, allowNull : false}
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = Vehicle;

