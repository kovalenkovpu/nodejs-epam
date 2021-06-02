// import { injectable, inject } from 'inversify';
import omit from 'lodash/omit';
import { Op } from 'sequelize';

import dataBase from '../../db/models';
import 'reflect-metadata';
import { IDataBase } from '../../db/models/types';
import { User } from '../../db/models/user';
import { generateNotFoundError } from '../common/utils/error-handling';
import { AuthData } from '../login/types/login-controller.types';
// import { TYPES } from '../types';

import { AutosuggestUsersResponse } from './types/user-controller.types';
import { UserBase, UserId } from './types/user-dto';
import { IUserService } from './types/user-service.types';

// @injectable()
class UserService implements IUserService {
  userModel: IDataBase['User'];

  constructor(
    dbInstance: IDataBase
    // @inject(TYPES.UserModel) userModel: IDataBase['User']
  ) {
    this.userModel = dbInstance.User;
    // this.userModel = userModel;
  }

  private getUserFromUserInstance = (userInstance: User) =>
    omit(userInstance.get(), ['isDeleted', 'createdAt', 'updatedAt']);

  getAll = async () => {
    const users = await this.userModel.findAll({
      where: { isDeleted: false },
    });

    return users.map(this.getUserFromUserInstance);
  };

  getAllWithCompleteData = async () => {
    const users = await this.userModel.findAll({
      include: {
        association: 'Groups',
        attributes: ['id', 'name', 'permissions'],
        through: {
          attributes: [],
        },
      },
    });

    // TODO: type properly the return type
    return users.map((user) => user.get());
  };

  getAutoSuggestUsers = async (
    loginSubstring: string,
    limit: number | undefined
  ) => {
    const users = await this.userModel.findAndCountAll({
      where: {
        isDeleted: false,
        login: {
          [Op.iLike]: `%${loginSubstring}%`,
        },
      },
      limit,
    });

    const autosuggestedUsers: AutosuggestUsersResponse = {
      totalCount: users.count,
      users: users.rows.map(this.getUserFromUserInstance),
    };

    return autosuggestedUsers;
  };

  getOne = async (id: UserId) => {
    const user = await this.userModel.findOne({
      where: { id, isDeleted: false },
    });

    if (!user) {
      return Promise.reject(generateNotFoundError(id, 'User'));
    }

    return this.getUserFromUserInstance(user);
  };

  findOneByCredentials = async ({ login, password }: AuthData) => {
    const user = await this.userModel.findOne({
      where: { login, isDeleted: false },
    });

    if (!user) {
      return Promise.reject(generateNotFoundError('', 'User'));
    }

    if (user.password !== password) {
      return Promise.reject(new Error());
    }

    return this.getUserFromUserInstance(user);
  };

  create = async (userData: UserBase) => {
    const newUser = await this.userModel.create(userData);

    return this.getUserFromUserInstance(newUser);
  };

  update = async (id: UserId, userData: UserBase) => {
    const user = await this.userModel.findOne({
      where: { id, isDeleted: false },
    });

    if (!user) {
      return Promise.reject(generateNotFoundError(id, 'User'));
    }

    const updatedUser = await user.update(userData);

    return this.getUserFromUserInstance(updatedUser);
  };

  delete = async (id: UserId) => {
    const user = await this.userModel.findOne({
      where: { id, isDeleted: false },
    });

    if (!user) {
      return Promise.reject(generateNotFoundError(id, 'User'));
    }

    // Remove assosiated groups from junction table
    const userGroups = await user.getGroups();
    const userGroupsIds = userGroups.map(({ id: groupId }) => groupId);
    await user.removeGroups(userGroupsIds);

    const updatedUser = await user.update(
      { isDeleted: true },
      {
        where: {
          id,
          isDeleted: false,
        },
      }
    );

    return this.getUserFromUserInstance(updatedUser);
  };
}

const userService = new UserService(dataBase);

export { userService };
