import { inject, injectable } from 'inversify';
import difference from 'lodash/difference';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import { Op, Sequelize } from 'sequelize';

import { Group as GroupModel } from '../../db/models/group';
import { IGroupModel, IUserModel } from '../../db/models/types';
import { generateNotFoundError } from '../common/utils/error-handling';
import { TYPES } from '../types';
import { UserId } from '../user/types/user-dto';

import { GroupBase, Group, GroupId } from './types/group-dto';
import { IGroupService } from './types/group-service.types';

@injectable()
class GroupService implements IGroupService {
  private sequelize: Sequelize;
  private userModel: IUserModel;
  private groupModel: IGroupModel;

  constructor(
    @inject(TYPES.Sequelize) sequelize: Sequelize,
    @inject(TYPES.UserModel) userModel: IUserModel,
    @inject(TYPES.GroupModel) groupModel: IGroupModel
  ) {
    this.sequelize = sequelize;
    this.groupModel = groupModel;
    this.userModel = userModel;
  }

  private getGroupFromGroupInstance = (groupInstance: GroupModel): Group =>
    omit(groupInstance.get(), ['createdAt', 'updatedAt']);

  getAll = async (): Promise<Group[]> => {
    const groups = await this.groupModel.findAll();

    return groups.map(this.getGroupFromGroupInstance);
  };

  getOne = async (id: GroupId): Promise<Group> => {
    const group = await this.groupModel.findOne({ where: { id } });

    if (!group) {
      return Promise.reject(generateNotFoundError(id, 'Group'));
    }

    return this.getGroupFromGroupInstance(group);
  };

  create = async (groupData: GroupBase): Promise<Group> => {
    const newGroup = await this.groupModel.create(groupData);

    return this.getGroupFromGroupInstance(newGroup);
  };

  update = async (id: GroupId, groupData: GroupBase): Promise<Group> => {
    const group = await this.groupModel.findOne({ where: { id } });

    if (!group) {
      return Promise.reject(generateNotFoundError(id, 'Group'));
    }

    const updatedGroup = await group.update(groupData);

    return this.getGroupFromGroupInstance(updatedGroup);
  };

  delete = async (id: GroupId): Promise<Group> => {
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

  addUsersToGroup = async (
    groupId: GroupId,
    usersIds: UserId[]
  ): Promise<Group> => {
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
      })) as GroupModel;

      return this.getGroupFromGroupInstance(updatedGroup);
    } catch (error) {
      await transaction.rollback();

      return Promise.reject(error);
    }
  };
}

export { GroupService };
