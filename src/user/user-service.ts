import { v4 as uuidv4 } from 'uuid';

import { IUserService } from './types/user-service.types';
import { User, UserDTO, UserId } from './user-dto';

class UserService implements IUserService {
	private users: UserDTO[] = [];

	getAll = () => this.users;

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
		const currentUser = this.users.find((user) => id === user.id);

		if (currentUser) {
			this.users = this.users.filter((user) => id !== user.id);

			return currentUser;
		}

		return;
	};
}

const userService = new UserService();

export { userService };
