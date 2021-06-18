import {
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationsMixin,
  Model,
  Optional,
} from 'sequelize/types';

import { GroupInstance } from '../../group/types/group-model.types';

import { UserDTO } from './user-dto';

type UserCreationAttributes = Optional<UserDTO, 'id' | 'isDeleted'>;

interface UserInstance extends Model<UserDTO, UserCreationAttributes>, UserDTO {
  // Inspired by: https://vivacitylabs.com/setup-typescript-sequelize/
  getGroups: BelongsToManyGetAssociationsMixin<GroupInstance>;
  removeGroups: BelongsToManyRemoveAssociationsMixin<
    GroupInstance,
    GroupInstance['id']
  >;
  // TODO: add more when needed
}

export type { UserInstance };
