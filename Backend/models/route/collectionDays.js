const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const CollectionDay = sequelize.define('collectionDay',{
    routeId : {type : DataTypes.INTEGER, allowNull : false},
    weekDay : {type : DataTypes.STRING, allowNull : false},
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = CollectionDay;


