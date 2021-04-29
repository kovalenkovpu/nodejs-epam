const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  UserGroup.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      group_id: {
        type: DataTypes.UUID,
        references: {
          model: 'Groups',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'UserGroup',
    }
  );
  return UserGroup;
};
