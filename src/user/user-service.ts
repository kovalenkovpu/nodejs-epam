import { Op } from 'sequelize';
import omit from 'lodash/omit';

import { IUserService } from './types/user-service.types';
import { UserBase, User, UserId } from './types/user-dto';
import { AutosuggestUsersResponse } from './types/user-controller.types';
import { UserInstance } from './types/user-model.types';

import dataBase from '../../db/models';
import { IDataBase } from '../common/types/db-types';
import { generateNotFoundMessage } from '../common/utils/error-handling';

// Dirty hack to make JS work with TS and preserve typings
const db = (dataBase as unknown) as IDataBase;

class UserService implements IUserService {
  userModel: IDataBase['User'];

  constructor(dbInstance: IDataBase) {
    this.userModel = dbInstance.User;
  }

  private getUserFromUserInstance = (userInstance: UserInstance): User =>
    omit(userInstance.get(), ['isDeleted', 'createdAt', 'updatedAt']);

  getAll = async () => {
    const users = await this.userModel.findAll({
      where: { isDeleted: false },
    });

    return users.map(this.getUserFromUserInstance);
  };

  getAllWithCompleteData = async () => {
    const users = await this.userModel.findAll();

    return users.map((user) => user.get());
  };

  getAutoSuggestUsers = async (
    loginSubstring: string,
    limit: number | undefined
  ) => {
    console.log('LIMIT: ', limit);
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
      return Promise.reject(generateNotFoundMessage(id, 'User'));
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
      return Promise.reject(generateNotFoundMessage(id, 'User'));
    }

    const updatedUser = await user.update(userData);

    return this.getUserFromUserInstance(updatedUser);
  };

  delete = async (id: UserId) => {
    const user = await this.userModel.findOne({
      where: { id, isDeleted: false },
    });

    if (!user) {
      return Promise.reject(generateNotFoundMessage(id, 'User'));
    }

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

const userService = new UserService(db);

export { userService };
