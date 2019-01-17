'use strict';
module.exports = (sequelize, DataTypes) => {
  const friend = sequelize.define('friend', {
    friendname: DataTypes.STRING,
    date: DataTypes.DATE,
    event: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  friend.associate = function(models) {
    // associations can be defined here
    models.friend.belongsTo(models.user);
    models.friend.belongsToMany(models.tag, { through: 'friendTag', onDelete: 'cascade' });
  };
  return friend;
};