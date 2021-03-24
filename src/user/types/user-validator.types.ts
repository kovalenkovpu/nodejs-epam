import { User, UserDTO } from './user-dto';

interface IUserValidator {
	validateUser: (newUser: User) => Promise<User>;

	validateUserUnique: (existingUsers: UserDTO[], newUser: User) => Promise<any>;
}

export type { IUserValidator };
