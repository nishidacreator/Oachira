const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Vendor = sequelize.define('vendor',{
    vendorName : {type : DataTypes.STRING, allowNull : false},
    address1 : {type : DataTypes.STRING, allowNull : false},
    address2 : {type : DataTypes.STRING, allowNull : false},
    state : {type : DataTypes.STRING, allowNull : false},
    vendorPhoneNumber : {type : DataTypes.STRING, allowNull : false},
    gstNo : {type : DataTypes.STRING, allowNull : false}
},
{
    freezeTableName: true,
})

module.exports = Vendor;


