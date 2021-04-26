import { Group, GroupBase, GroupId } from './group-dto';

import { IDataBase } from '../../common/types/db-types';

interface IGroupService {
  groupModel: IDataBase['Group'];

  getAll: () => Promise<Group[]>;

  getOne: (id: GroupId) => Promise<Group | undefined>;

  create: (group: GroupBase) => Promise<Group | undefined>;

  update: (id: GroupId, group: GroupBase) => Promise<Group | undefined>;

  delete: (id: GroupId) => Promise<Group | undefined>;
}

export type { IGroupService };
