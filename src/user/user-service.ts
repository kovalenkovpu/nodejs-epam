import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
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

  private getUserDTOsWithoutDeleted = (userDTOs: UserDTO[]) =>
    userDTOs.filter(({ isDeleted }) => !isDeleted);

  private getUserFromUserDTO = (userDTO: UserDTO): User =>
    omit(userDTO, ['isDeleted']);

  private getUsersFromUserDTOs = (userDTOs: UserDTO[]) =>
    userDTOs.map<User>(this.getUserFromUserDTO);

  getAllWithCompleteData = () => this.userModel.getAll();

  getAll = async () => {
    const allUsers = await this.userModel.getAll();
    const allUsersWithoutDeleted = this.getUserDTOsWithoutDeleted(allUsers);
    const users = this.getUsersFromUserDTOs(allUsersWithoutDeleted);

    return users;
  };

  getAutoSuggestUsers = async (
    loginSubstring: string | undefined = '',
    limit: string | undefined
  ) => {
    const userDTOs = await this.userModel.getAll();
    const userDTOsWithoutDeleted = this.getUserDTOsWithoutDeleted(userDTOs);
    const users = this.getUsersFromUserDTOs(userDTOsWithoutDeleted);

    // "limit" might be not provided - return all users
    const safeLimit = isEmpty(limit) ? users.length : Number(limit);

    // Filter users by their "login", sort them by the "login"
    const filteredUsers = users.filter(({ login }) =>
      login.includes(loginSubstring)
    );
    const sortedUsers = sortBy(filteredUsers, ['login']);

    // Return "totalCount" to indicate how many results there're regardless
    // of the "limit" in request - FE convenience
    const autosuggestedUsers: AutosuggestUsersResponse = {
      totalCount: sortedUsers.length,
      users: sortedUsers.slice(0, safeLimit),
    };

    return autosuggestedUsers;
  };

  getOne = async (id: UserId) => {
    const user = await this.userModel.getOne(id);

    if (user && !user.isDeleted) {
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
