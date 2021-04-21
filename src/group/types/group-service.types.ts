import { Group, GroupBase, GroupId } from './group-dto';
import { IGroupModel } from './group-model.types';

interface IGroupService {
  groupModel: IGroupModel;

  getAll: () => Promise<Group[]>;

  getOne: (id: GroupId) => Promise<Group | undefined>;

  create: (group: GroupBase) => Promise<Group | undefined>;

  update: (id: GroupId, group: GroupBase) => Promise<Group | undefined>;

  delete: (id: GroupId) => Promise<Group | undefined>;
}

export type { IGroupService };
