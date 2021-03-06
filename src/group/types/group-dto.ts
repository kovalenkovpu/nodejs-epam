import { User } from '../../user/types/user-dto';
import { PERMISSIONS } from '../constants';

type Permission = keyof typeof PERMISSIONS;

interface GroupBase {
  name: string;
  permissions: Permission[];
}

type GroupId = string;

interface GroupDTO extends GroupBase {
  id: GroupId;
  createdAt?: Date;
  updatedAt?: Date;
  Users?: User[];
}

type Group = Omit<GroupDTO, 'createdAt' | 'updatedAt'>;

export type { Permission, GroupId, GroupBase, GroupDTO, Group };
