const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../utils/db')

const User = sequelize.define('user', {
  // Model attributes are defined here
  name: {type: DataTypes.STRING, allowNull : false},
  phoneNumber: {type: DataTypes.STRING, allowNull : false},
  password: {type: DataTypes.STRING, allowNull : false},
  roleId: {type: DataTypes.INTEGER, allowNull : false},
  status: {type: DataTypes.BOOLEAN, allowNull : false},
  branchId: {type: DataTypes.INTEGER, allowNull : false},
// },{
//   defaultScope: {
//     attributes: { exclude: ['password'] }
//   }
},
{
  freezeTableName: true
});

module.exports = User