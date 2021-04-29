import omit from 'lodash/omit';

import { IGroupService } from './types/group-service.types';
import { Group, GroupBase, GroupId } from './types/group-dto';
import { GroupInstance } from './types/group-model.types';

import { IDataBase } from '../common/types/db-types';
import { generateNotFoundMessage } from '../common/utils/error-handling';
import dataBase from '../../db/models';

// Dirty hack to make JS work with TS and preserve typings
const db = (dataBase as unknown) as IDataBase;

class GroupService implements IGroupService {
  groupModel: IDataBase['Group'];

  constructor(dbInstance: IDataBase) {
    this.groupModel = dbInstance.Group;
  }

  private getGroupFromGroupInstance = (groupInstance: GroupInstance): Group =>
    omit(groupInstance.get(), ['createdAt', 'updatedAt']);

  getAll = async () => {
    const groups = await this.groupModel.findAll();

    return groups.map(this.getGroupFromGroupInstance);
  };

  getOne = async (id: GroupId) => {
    const group = await this.groupModel.findOne({ where: { id } });

    if (!group) {
      return Promise.reject(generateNotFoundMessage(id, 'Group'));
    }

    return this.getGroupFromGroupInstance(group);
  };

  create = async (groupData: GroupBase) => {
    const newGroup = await this.groupModel.create(groupData);

    return this.getGroupFromGroupInstance(newGroup);
  };

  update = async (id: GroupId, groupData: GroupBase) => {
    const group = await this.groupModel.findOne({ where: { id } });

    if (!group) {
      return Promise.reject(generateNotFoundMessage(id, 'Group'));
    }

    const updatedGroup = await group.update(groupData);

    return this.getGroupFromGroupInstance(updatedGroup);
  };

  delete = async (id: GroupId) => {
    const group = await this.groupModel.findOne({ where: { id } });

    if (!group) {
      return Promise.reject(generateNotFoundMessage(id, 'Group'));
    }

    // Remove assosiated users from junction table
    const groupUsers = await group.getUsers();
    const groupUsersIds = groupUsers.map(({ id: userId }) => userId);
    await group.removeUsers(groupUsersIds);

    await group.destroy();

    return this.getGroupFromGroupInstance(group);
  };
}

const groupService = new GroupService(db);

export { groupService };
