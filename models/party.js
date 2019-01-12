'use strict';
module.exports = (sequelize, DataTypes) => {
  const party = sequelize.define('party', {
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    date: DataTypes.DATE,
    numClowns: DataTypes.INTEGER
  }, {});
  party.associate = function(models) {
    // associations can be defined here
    models.party.belongsTo(models.user);
    models.party.belongsToMany(models.clown, {through: 'partyClown'});
  };
  return party;
};