'use strict';
module.exports = (sequelize, DataTypes) => {
  const partyClown = sequelize.define('partyClown', {
    partyId: DataTypes.INTEGER,
    clownId: DataTypes.INTEGER
  }, {});
  partyClown.associate = function(models) {
    // associations can be defined here
  };
  return partyClown;
};