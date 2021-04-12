import { Op } from 'sequelize';
import { db } from '../db';
import { usersSeeds } from '../db/seeders/users';
import { IDB } from '../db/types/db.types';

import { UserBase, UserId } from './types/user-dto';
import { IUserModel } from './types/user-model.types';

class UserModel implements IUserModel {
  private db;

  constructor(dbInstance: IDB) {
    this.db = dbInstance;
    this.initUsersTable();
  }

  private initUsersTable = async () => {
    try {
      // TODO: should be replaced by Sequalize migrations
      await this.db.User.sync({ force: true });
      await this.db.User.bulkCreate(usersSeeds);
    } catch (error) {
      throw new Error(error);
    }
  };

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
