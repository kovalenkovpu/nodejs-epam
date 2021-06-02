import {
  Model,
  DataTypes,
  Sequelize,
  Optional,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManyAddAssociationsMixin,
  Association,
} from 'sequelize';

import { GroupDTO, Permission } from '../../src/group/types/group-dto';

import { IDataBase } from './types';
import { User } from './user';

type GroupCreationAttributes = Optional<GroupDTO, 'id'>;

class Group
  extends Model<GroupDTO, GroupCreationAttributes>
  implements GroupDTO {
  public id!: string;
  public name!: string;
  public permissions!: Permission[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getUsers: BelongsToManyGetAssociationsMixin<User>;
  public removeUsers: BelongsToManyRemoveAssociationsMixin<User, User['id']>;
  public addUsers: BelongsToManyAddAssociationsMixin<User, User['id']>;

  static associations: {
    users: Association<Group, User>;
  };

  static associate(db: IDataBase): void {
    Group.belongsToMany(db.User, {
      through: 'UserGroups',
      onDelete: 'cascade',
      foreignKey: 'group_id',
    });
  }
}

const initGroup = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
): typeof Group => {
  Group.init(
    {
      id: {
        type: dataTypes.UUID,
        primaryKey: true,
        defaultValue: dataTypes.UUIDV4,
      },
      name: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      permissions: {
        type: dataTypes.ARRAY(dataTypes.STRING),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Group',
    }
  );

  return Group;
};

export { Group, initGroup };
