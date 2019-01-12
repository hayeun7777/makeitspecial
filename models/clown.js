'use strict';
module.exports = (sequelize, DataTypes) => {
  const clown = sequelize.define('clown', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    perHr: DataTypes.INTEGER
  }, {});
  clown.associate = function(models) {
    // associations can be defined here
    models.clown.belongsToMany(models.party, {through: 'partyClown'});
  };
  return clown;
};