import {
  DataTypes,
  Model,
  Sequelize,
  Optional,
  Association,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationsMixin,
} from 'sequelize';

import { UserDTO } from '../../src/user/types/user-dto';

import { Group } from './group';
import { IDataBase } from './types';

type UserCreationAttributes = Optional<UserDTO, 'id' | 'isDeleted'>;

class User extends Model<UserDTO, UserCreationAttributes> implements UserDTO {
  public id!: string;
  public login!: string;
  public password!: string;
  public age!: number;
  public isDeleted!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getGroups: BelongsToManyGetAssociationsMixin<Group>;
  public removeGroups: BelongsToManyRemoveAssociationsMixin<Group, Group['id']>;

  static associations: {
    groups: Association<User, Group>;
  };

  static associate(db: IDataBase): void {
    User.belongsToMany(db.Group, {
      through: 'UserGroups',
      onDelete: 'cascade',
      foreignKey: 'user_id',
    });
  }
}

const initUser = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
): typeof User => {
  User.init(
    {
      id: {
        type: dataTypes.UUID,
        primaryKey: true,
        defaultValue: dataTypes.UUIDV4,
      },
      login: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
      isDeleted: {
        type: dataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};

export { User, initUser };
