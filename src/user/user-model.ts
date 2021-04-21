import { Op } from 'sequelize';

import dataBase from '../../db/models';
import { IDataBase } from '../common/types/db-types';
import { UserBase, UserId } from './types/user-dto';
import { IUserModel } from './types/user-model.types';

// Dirty hack to make JS work with TS and preserve typings
const db = (dataBase as unknown) as IDataBase;

class UserModel implements IUserModel {
  private db;

  constructor(dbInstance: IDataBase) {
    this.db = dbInstance;
  }

  getAll = async () => {
    const users = await this.db.User.findAll({
      where: { isDeleted: false },
    });

    return users.map((user) => user.get());
  };

  getAllWithCompleteData = async () => {
    const users = await this.db.User.findAll();

    return users.map((user) => user.get());
  };

  getAutoSuggestUsers = async (
    loginSubstring: string,
    limit: number | undefined
  ) => {
    const users = await this.db.User.findAll({
      where: {
        isDeleted: false,
        login: {
          [Op.iLike]: `%${loginSubstring}%`,
        },
      },
      limit,
    });

    return users.map((user) => user.get());
  };

  getOne = async (id: UserId) => {
    const user = await this.db.User.findOne({
      where: { id, isDeleted: false },
    });

    return user?.get();
  };

  create = async (userData: UserBase) => {
    const newUser = await this.db.User.create(userData);

    return newUser.get();
  };

  update = async (id: UserId, userData: UserBase) => {
    const [, affectedUsers] = await this.db.User.update(userData, {
      where: {
        id,
        isDeleted: false,
      },
      returning: true,
    });
    const [updatedUser] = affectedUsers;

    return updatedUser?.get();
  };

  delete = async (id: UserId) => {
    const [, affectedUsers] = await this.db.User.update(
      { isDeleted: true },
      {
        where: {
          id,
          isDeleted: false,
        },
        returning: true,
      }
    );
    const [updatedUser] = affectedUsers;

    return updatedUser?.get();
  };
}

const userModel = new UserModel(db);

export { userModel };
