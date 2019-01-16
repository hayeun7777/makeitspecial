'use strict';
module.exports = (sequelize, DataTypes) => {
  const friendTag = sequelize.define('friendTag', {
    friendId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER
  }, {});
  friendTag.associate = function(models) {
    // associations can be defined here
  };
  return friendTag;
};