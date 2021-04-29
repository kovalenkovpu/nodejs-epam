import {
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationsMixin,
  Model,
  Optional,
} from 'sequelize/types';

import { UserInstance } from '../../user/types/user-model.types';

import { GroupDTO } from './group-dto';

type GroupCreationAttributes = Optional<GroupDTO, 'id'>;

interface GroupInstance
  extends Model<GroupDTO, GroupCreationAttributes>,
    GroupDTO {
  // Inspired by: https://vivacitylabs.com/setup-typescript-sequelize/
  getUsers: BelongsToManyGetAssociationsMixin<UserInstance>;
  removeUsers: BelongsToManyRemoveAssociationsMixin<
    UserInstance,
    UserInstance['id']
  >;
  // TODO: add more when needed
}

export type { GroupInstance };
