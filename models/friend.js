'use strict';
module.exports = (sequelize, DataTypes) => {
  const friend = sequelize.define('friend', {
    friendname: DataTypes.STRING,
    date: DataTypes.DATE,
    event: DataTypes.STRING
  }, {});
  friend.associate = function(models) {
    // associations can be defined here
    models.friend.belongsToMany(models.tag, { through: 'friendTag', onDelete: 'cascade' });
  };
  return friend;
};