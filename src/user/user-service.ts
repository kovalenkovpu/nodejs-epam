import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import { v4 as uuidv4 } from 'uuid';

import { IUserService } from './types/user-service.types';
import { User, UserDTO, UserId } from './types/user-dto';
import { AutosuggestUsersResponse } from './types/user-controller.types';

class UserService implements IUserService {
  private users: UserDTO[] = [];

  get usersWithoutDeleted() {
    return this.users.filter(({ isDeleted }) => !isDeleted);
  }

  getAll = () => this.users;

  getAutoSuggestUsers = (
    loginSubstring: string | undefined = '',
    limit: string | undefined
  ) => {
    // "limit" might be not provided - return all users
    const safeLimit = isEmpty(limit)
      ? this.usersWithoutDeleted.length
      : Number(limit);

    // Filter users by their "login", sort them by the "login"
    const filteredUsers = this.usersWithoutDeleted.filter(({ login }) =>
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

  getOne = (id: UserId) =>
    this.usersWithoutDeleted.find((user) => id === user.id);

  create = (user: User) => {
    const newUser: UserDTO = {
      ...user,
      id: uuidv4(),
      isDeleted: false,
    };

    this.users.push(newUser);

    return newUser;
  };

  update = (id: UserId, user: User) => {
    const currentUserIndex = this.users.findIndex(
      (currentUser) => id === currentUser.id
    );

    if (currentUserIndex !== -1 && !this.users[currentUserIndex].isDeleted) {
      const updatedUser: UserDTO = {
        ...this.users[currentUserIndex],
        ...user,
      };

      this.users[currentUserIndex] = updatedUser;

      return updatedUser;
    }

    return;
  };

  delete = (id: UserId) => {
    const currentUserIndex = this.users.findIndex((user) => id === user.id);

    if (currentUserIndex !== -1 && !this.users[currentUserIndex].isDeleted) {
      this.users[currentUserIndex].isDeleted = true;

      return this.users[currentUserIndex];
    }

    return;
  };
}

const userService = new UserService();

export { userService };
