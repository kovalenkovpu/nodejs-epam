import difference from 'lodash/difference';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import { Op } from 'sequelize';

import dataBase from '../../db/models';
import { IDataBase } from '../common/types/db-types';
import { generateNotFoundError } from '../common/utils/error-handling';
import { UserId } from '../user/types/user-dto';

import { Group, GroupBase, GroupId } from './types/group-dto';
import { GroupInstance } from './types/group-model.types';
import { IGroupService } from './types/group-service.types';

// Dirty hack to make JS work with TS and preserve typings
const db = (dataBase as unknown) as IDataBase;

class GroupService implements IGroupService {
  sequelize: IDataBase['sequelize'];
  groupModel: IDataBase['Group'];
  userModel: IDataBase['User'];

  constructor(dbInstance: IDataBase) {
    this.sequelize = dbInstance.sequelize;
    this.groupModel = dbInstance.Group;
    this.userModel = dbInstance.User;
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
      return Promise.reject(generateNotFoundError(id, 'Group'));
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
      return Promise.reject(generateNotFoundError(id, 'Group'));
    }

    const updatedGroup = await group.update(groupData);

    return this.getGroupFromGroupInstance(updatedGroup);
  };

  delete = async (id: GroupId) => {
    const group = await this.groupModel.findOne({ where: { id } });

    if (!group) {
      return Promise.reject(generateNotFoundError(id, 'Group'));
    }

    // Remove assosiated users from junction table
    const groupUsers = await group.getUsers();
    const groupUsersIds = groupUsers.map(({ id: userId }) => userId);
    await group.removeUsers(groupUsersIds);

    await group.destroy();

    return this.getGroupFromGroupInstance(group);
  };

  addUsersToGroup = async (groupId: GroupId, usersIds: UserId[]) => {
    const transaction = await this.sequelize.transaction();

    try {
      const group = await this.groupModel.findOne({
        where: { id: groupId },
        transaction,
      });

      if (!group) {
        throw generateNotFoundError(groupId, 'Group');
      }

      const users = await this.userModel.findAll({
        where: {
          id: {
            [Op.in]: usersIds,
          },
          isDeleted: false,
        },
        attributes: ['id'],
        transaction,
      });

      const usersIdsExisting = users.map(({ id }) => id);

      if (isEmpty(users)) {
        throw generateNotFoundError(usersIds.join(), 'User');
      }

      if (usersIdsExisting.length < usersIds.length) {
        const notFoundIds = difference(usersIds, usersIdsExisting);

        throw generateNotFoundError(notFoundIds.join(), 'User');
      }

      // https://khalilstemmler.com/articles/sequelize-tags-junction-pattern
      await group.addUsers(usersIds, { transaction });

      await transaction.commit();

      // Here event after commit() "group" doesn't have updated users,
      // so we need to query the group again.
      const updatedGroup = (await this.groupModel.findOne({
        where: { id: groupId },
        include: {
          association: 'Users',
          attributes: ['id', 'login', 'password', 'age'],
          through: { attributes: [] },
        },
        // "updatedGroup" always exists, so it's done for TS purposes only
      })) as GroupInstance;

      return this.getGroupFromGroupInstance(updatedGroup);
    } catch (error) {
      await transaction.rollback();

      return Promise.reject(error);
    }
  };
}

const groupService = new GroupService(db);

export { groupService };
