import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import omit from 'lodash/omit';
import { v4 as uuidv4 } from 'uuid';

import { IUserService } from './types/user-service.types';
import { UserBase, UserDTO, User, UserId } from './types/user-dto';
import { AutosuggestUsersResponse } from './types/user-controller.types';

class UserService implements IUserService {
  private _users: UserDTO[] = [];

  get userDTOsWithDeleted() {
    return this._users;
  }

  get userDTOsWithoutDeleted() {
    return this._users.filter(({ isDeleted }) => !isDeleted);
  }

  getUserFromUserDTO = (userDTO: UserDTO) => omit(userDTO, ['isDeleted']);

  getUsers(users: UserDTO[]): User[] {
    return users.map(({ isDeleted, ...user }) => user);
  }

  getAll = () => this.getUsers(this.userDTOsWithoutDeleted);

  getAutoSuggestUsers = (
    loginSubstring: string | undefined = '',
    limit: string | undefined
  ) => {
    const users = this.getAll();
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

  getOne = (id: UserId) => this.getAll().find((user) => id === user.id);

  create = (userData: UserBase) => {
    const newUser: UserDTO = {
      ...userData,
      id: uuidv4(),
      isDeleted: false,
    };

    this._users.push(newUser);

    return this.getUserFromUserDTO(newUser);
  };

  update = (id: UserId, userData: UserBase) => {
    const currentUserIndex = this._users.findIndex(
      (currentUser) => id === currentUser.id
    );

    if (currentUserIndex !== -1 && !this._users[currentUserIndex].isDeleted) {
      const updatedUser: UserDTO = {
        ...this._users[currentUserIndex],
        ...userData,
      };

      this._users[currentUserIndex] = updatedUser;

      return this.getUserFromUserDTO(updatedUser);
    }

    return;
  };

  delete = (id: UserId) => {
    const currentUserIndex = this._users.findIndex((user) => id === user.id);

    if (currentUserIndex !== -1 && !this._users[currentUserIndex].isDeleted) {
      this._users[currentUserIndex].isDeleted = true;

      return this.getUserFromUserDTO(this._users[currentUserIndex]);
    }

    return;
  };
}

const userService = new UserService();

export { userService };
