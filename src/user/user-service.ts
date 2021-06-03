import { injectable, inject } from 'inversify';
import omit from 'lodash/omit';
import { Op } from 'sequelize';

import { IUserModel } from '../../db/models/types';
import { User as UserModel } from '../../db/models/user';
import { generateNotFoundError } from '../common/utils/error-handling';
import { TYPES } from '../inversify.types';
import { AuthData } from '../login/types/login-controller.types';

import { AutosuggestUsersResponse } from './types/user-controller.types';
import { UserBase, UserDTO, User, UserId } from './types/user-dto';
import { IUserService } from './types/user-service.types';

@injectable()
class UserService implements IUserService {
  private userModel: IUserModel;

  constructor(@inject(TYPES.UserModel) userModel: IUserModel) {
    this.userModel = userModel;
  }

  private getUserFromUserInstance = (userInstance: UserModel): User =>
    omit(userInstance.get(), ['isDeleted', 'createdAt', 'updatedAt']);

  getAll = async (): Promise<User[]> => {
    const users = await this.userModel.findAll({
      where: { isDeleted: false },
    });

    return users.map(this.getUserFromUserInstance);
  };

  getAllWithCompleteData = async (): Promise<UserDTO[]> => {
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
  ): Promise<AutosuggestUsersResponse> => {
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

  getOne = async (id: UserId): Promise<User> => {
    const user = await this.userModel.findOne({
      where: { id, isDeleted: false },
    });

    if (!user) {
      return Promise.reject(generateNotFoundError(id, 'User'));
    }

    return this.getUserFromUserInstance(user);
  };

  findOneByCredentials = async ({
    login,
    password,
  }: AuthData): Promise<User> => {
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

  create = async (userData: UserBase): Promise<User> => {
    const newUser = await this.userModel.create(userData);

    return this.getUserFromUserInstance(newUser);
  };

  update = async (id: UserId, userData: UserBase): Promise<User> => {
    const user = await this.userModel.findOne({
      where: { id, isDeleted: false },
    });

    if (!user) {
      return Promise.reject(generateNotFoundError(id, 'User'));
    }

    const updatedUser = await user.update(userData);

    return this.getUserFromUserInstance(updatedUser);
  };

  delete = async (id: UserId): Promise<User> => {
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

export { UserService };
