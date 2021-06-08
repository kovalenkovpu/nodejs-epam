import { injectable } from 'inversify';
import 'reflect-metadata';

import { Group } from '../group/types/group-dto';
import { IGroupService } from '../group/types/group-service.types';

import { mockGroup, mockGroups, mockGroupUpdated } from './group-data';

@injectable()
class MockGroupService implements IGroupService {
  getAll = async (): Promise<Group[]> => Promise.resolve(mockGroups);
  getOne = (): Promise<Group | undefined> => Promise.resolve(mockGroup);
  create = (): Promise<Group | undefined> => Promise.resolve(mockGroup);
  update = (): Promise<Group | undefined> => Promise.resolve(mockGroupUpdated);
  delete = (): Promise<Group | undefined> => Promise.resolve(mockGroup);
  addUsersToGroup = (): Promise<Group> => Promise.resolve(mockGroup);
}

export { MockGroupService };
