import {
  DataTypes,
  Sequelize,
  ModelCtor,
  ModelOptions,
  ModelAttributes,
} from 'sequelize';

import { UserInstance } from '../types/user-model.types';

const initUserTable = (sequalize: Sequelize): ModelCtor<UserInstance> => {
  const modelOptions: ModelOptions = {
    modelName: 'User',
    tableName: 'Users',
  };

  const attributes: ModelAttributes<UserInstance> = {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  };

  return sequalize.define<UserInstance>('User', attributes, modelOptions);
};

export { initUserTable };
