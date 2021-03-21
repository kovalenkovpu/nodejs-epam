import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import { v4 as uuidv4 } from 'uuid';

import { IUserService } from './types/user-service.types';
import { User, UserDTO, UserId } from './user-dto';

class UserService implements IUserService {
	private users: UserDTO[] = [];

	getAll = () => this.users;

	getAutoSuggestUsers = (
		loginSubstring: string | undefined = '',
		limit: string | undefined
	) => {
		// "limit" might be not provided - return all users
		const safeLimit = isEmpty(limit) ? this.users.length : Number(limit);
		const filteredUsers = this.users.filter(({ login }) =>
			login.includes(loginSubstring)
		);

		const sortedUsers = sortBy(filteredUsers, ['login']);

		return sortedUsers.slice(0, safeLimit);
	};

	getOne = (id: UserId) => this.users.find((user) => id === user.id);

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
		const currentUserIndex = this.users.findIndex((user) => id === user.id);

		if (currentUserIndex !== -1) {
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

		if (currentUserIndex !== -1) {
			const updatedUser: UserDTO = {
				...this.users[currentUserIndex],
				isDeleted: true,
			};

			this.users[currentUserIndex] = updatedUser;

			return updatedUser;
		}

		return;
	};
}

const userService = new UserService();

export { userService };
