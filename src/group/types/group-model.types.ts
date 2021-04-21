import { Model, Optional } from 'sequelize/types';

import { GroupId, GroupBase, GroupDTO } from './group-dto';

type GroupCreationAttributes = Optional<GroupDTO, 'id'>;

interface GroupInstance
  extends Model<GroupDTO, GroupCreationAttributes>,
    GroupDTO {}

interface IGroupModel {
  getAll: () => Promise<GroupDTO[]>;

  getOne: (id: GroupId) => Promise<GroupDTO | undefined>;

  create: (group: GroupBase) => Promise<GroupDTO | undefined>;

  update: (id: GroupId, groupData: GroupBase) => Promise<GroupDTO | undefined>;

  delete: (id: GroupId) => Promise<GroupDTO | undefined>;
}

export type { GroupInstance, IGroupModel };
