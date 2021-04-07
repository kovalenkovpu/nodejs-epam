import { User } from '../db/models/user';

import { UserBase, UserId } from './types/user-dto';
import { IUserModel } from './types/user-model.types';

class UserModel implements IUserModel {
  private getUserDataFromInstance = (user: User | null) => user?.get();

  constructor() {
    this.initUsersTable();
  }

  private initUsersTable = async () => {
    try {
      await User.sync();
    } catch (error) {
      throw new Error(error);
    }
  };

  getAll = async () => {
    const users = await User.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    return users.map((user) => user.get());
  };

  getOne = async (id: UserId) => {
    const user = await User.findByPk(id);

    return this.getUserDataFromInstance(user);
  };

  create = async (userData: UserBase) => {
    const newUser = await User.create(userData);

    return newUser.get();
  };

  update = async (id: UserId, userData: UserBase) => {
    const user = await User.findByPk(id);

    if (user && !user.isDeleted) {
      await user.update(userData);

      return this.getUserDataFromInstance(user);
    }
  };

  delete = async (id: UserId) => {
    const user = await User.findByPk(id);

    if (user && !user.isDeleted) {
      await user.update({ isDeleted: true });

      return this.getUserDataFromInstance(user);
    }
  };
}

const userModel = new UserModel();

export { userModel };
