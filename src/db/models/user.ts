import { Model, DataTypes, Optional } from 'sequelize';

import { sequelize } from '..';
import { UserDTO, UserId } from '../../user/types/user-dto';

// prettier-ignore
type UserCreationAttributes = Optional<UserDTO, 'id' | 'isDeleted'>

class User extends Model<UserDTO, UserCreationAttributes> implements UserDTO {
  public id!: UserId;
  public login!: string;
  public password!: string;
  public age!: number;
  public isDeleted!: boolean;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
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
  },
  {
    sequelize, // We need to pass the connection instance
    // modelName: 'User', // We need to choose the model name
    tableName: 'Users',
    freezeTableName: true,
  }
);

export { User };
