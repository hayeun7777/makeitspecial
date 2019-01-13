'use strict';
module.exports = (sequelize, DataTypes) => {
  const gift = sequelize.define('gift', {
    item: DataTypes.STRING,
    price: DataTypes.NUMERIC,
    photo: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  gift.associate = function(models) {
    // associations can be defined here
  };
  return gift;
};