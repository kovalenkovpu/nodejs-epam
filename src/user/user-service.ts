import omit from 'lodash/omit';

import { IUserService } from './types/user-service.types';
import { UserBase, UserDTO, User, UserId } from './types/user-dto';
import { AutosuggestUsersResponse } from './types/user-controller.types';
import { IUserModel } from './types/user-model.types';
import { userModel as userModelInstance } from './user-model';

class UserService implements IUserService {
  userModel: IUserModel;

  constructor(userModel: IUserModel) {
    this.userModel = userModel;
  }

  private getUserFromUserDTO = (userDTO: UserDTO): User =>
    omit(userDTO, ['isDeleted', 'createdAt', 'updatedAt']);

  getAll = async () => {
    const users = await this.userModel.getAll();

    return users.map(this.getUserFromUserDTO);
  };

  getAllWithCompleteData = () => this.userModel.getAllWithCompleteData();

  getAutoSuggestUsers = async (
    loginSubstring: string,
    limit: number | undefined
  ) => {
    const userDTOs = await this.userModel.getAutoSuggestUsers(
      loginSubstring,
      limit
    );
    const autosuggestedUsers: AutosuggestUsersResponse = {
      totalCount: userDTOs.length,
      users: userDTOs.map(this.getUserFromUserDTO),
    };

    return autosuggestedUsers;
  };

  getOne = async (id: UserId) => {
    const user = await this.userModel.getOne(id);

    if (user) {
      return this.getUserFromUserDTO(user);
    }
  };

  create = async (userData: UserBase) => {
    const newUser = await this.userModel.create(userData);

    if (newUser) {
      return this.getUserFromUserDTO(newUser);
    }
  };

  update = async (id: UserId, userData: UserBase) => {
    const updatedUser = await this.userModel.update(id, userData);

    if (updatedUser) {
      return this.getUserFromUserDTO(updatedUser);
    }
  };

  delete = async (id: UserId) => {
    const deletedUser = await this.userModel.delete(id);

    if (deletedUser) {
      return this.getUserFromUserDTO(deletedUser);
    }
  };
}

const userService = new UserService(userModelInstance);

export { userService };
