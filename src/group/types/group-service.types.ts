import { UserId } from '../../user/types/user-dto';

import { Group, GroupBase, GroupId } from './group-dto';

interface IGroupService {
  getAll: () => Promise<Group[]>;

  getOne: (id: GroupId) => Promise<Group | undefined>;

  create: (group: GroupBase) => Promise<Group | undefined>;

  update: (id: GroupId, group: GroupBase) => Promise<Group | undefined>;

  delete: (id: GroupId) => Promise<Group | undefined>;

  addUsersToGroup: (id: GroupId, usersIds: UserId[]) => Promise<Group>;
}

export type { IGroupService };
