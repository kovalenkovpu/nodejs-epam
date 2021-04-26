import { Model, Optional } from 'sequelize/types';

import { GroupDTO } from './group-dto';

type GroupCreationAttributes = Optional<GroupDTO, 'id'>;

interface GroupInstance
  extends Model<GroupDTO, GroupCreationAttributes>,
    GroupDTO {}

export type { GroupInstance };
