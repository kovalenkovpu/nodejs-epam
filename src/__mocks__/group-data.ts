import { PERMISSIONS } from '../group/constants';
import { Group, GroupBase } from '../group/types/group-dto';

import { mockUsers } from './user-data';

const groupCreationData: GroupBase = {
  name: 'Users_rw',
  permissions: [PERMISSIONS.READ, PERMISSIONS.WRITE],
};

const groupUpdateData: GroupBase = {
  name: 'Users_r',
  permissions: [PERMISSIONS.READ, PERMISSIONS.DELETE],
};

const mockGroup: Group = {
  id: '470cf674-0815-43c7-b531-dbd585f733e0',
  ...groupCreationData,
};

const mockGroupUpdated: Group = {
  id: '470cf674-0815-43c7-b531-dbd585f733e0',
  ...groupUpdateData,
};

const mockGroups = [mockGroup];
const groupWithAssignedUsers: Group = {
  ...mockGroup,
  Users: mockUsers,
};

export {
  groupCreationData,
  groupUpdateData,
  mockGroup,
  mockGroupUpdated,
  mockGroups,
  groupWithAssignedUsers,
};
