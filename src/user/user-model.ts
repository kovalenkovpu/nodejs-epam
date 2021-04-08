import { db } from '../db';
import { IDB } from '../db/types/db.types';
import { UserInstance } from '../db/types/user-model.types';

import { UserBase, UserId } from './types/user-dto';
import { IUserModel } from './types/user-model.types';

class UserModel implements IUserModel {
  EXCLUDE_OPTIONS = { exclude: ['createdAt', 'updatedAt'] };

  private getUserDataFromInstance = (user: UserInstance | null) => user?.get();
  private db;

  constructor(dbInstance: IDB) {
    this.db = dbInstance;
    this.initUsersTable();
  }

  private initUsersTable = async () => {
    try {
      await this.db.User.sync();
    } catch (error) {
      throw new Error(error);
    }
  };

  getAll = async () => {
    const users = await this.db.User.findAll({
      attributes: this.EXCLUDE_OPTIONS,
    });

    return users.map((user) => user.get());
  };

  getOne = async (id: UserId) => {
    const user = await this.db.User.findByPk(id, {
      attributes: this.EXCLUDE_OPTIONS,
    });

    return this.getUserDataFromInstance(user);
  };

  create = async (userData: UserBase) => {
    const newUser = await this.db.User.create(userData);

    return newUser.get();
  };

  update = async (id: UserId, userData: UserBase) => {
    const user = await this.db.User.findByPk(id);

    if (user && !user.isDeleted) {
      await user.update(userData);

      return this.getUserDataFromInstance(user);
    }
  };

  delete = async (id: UserId) => {
    const user = await this.db.User.findByPk(id);

    if (user && !user.isDeleted) {
      await user.update({ isDeleted: true });

      return this.getUserDataFromInstance(user);
    }
  };
}

const userModel = new UserModel(db);

export { userModel };
