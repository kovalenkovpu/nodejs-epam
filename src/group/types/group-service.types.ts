import { Group, GroupBase, GroupId } from './group-dto';

import { IDataBase } from '../../common/types/db-types';
import { UserId } from '../../user/types/user-dto';

interface IGroupService {
  sequelize: IDataBase['sequelize'];
  groupModel: IDataBase['Group'];
  userModel: IDataBase['User'];

  getAll: () => Promise<Group[]>;

  getOne: (id: GroupId) => Promise<Group | undefined>;

  create: (group: GroupBase) => Promise<Group | undefined>;

  update: (id: GroupId, group: GroupBase) => Promise<Group | undefined>;

  delete: (id: GroupId) => Promise<Group | undefined>;

  addUsersToGroup: (id: GroupId, usersIds: UserId[]) => Promise<Group>;
}

export type { IGroupService };
