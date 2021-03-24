import { IUserValidator } from './types/user-validator.types';
import { User, UserDTO } from './types/user-dto';
import { userLoginSchema, userSchema } from './user-schema';

class UserValidator implements IUserValidator {
	validateUser = (newUser: User) => {
		// For TS purposes - Joi's "validateASync" returns "Promise<any>"
		return userSchema.validateAsync(newUser) as Promise<User>;
	};

	validateUserUnique = (existingUsers: UserDTO[], newUser: User) => {
		return userLoginSchema.validateAsync([...existingUsers, newUser]);
	};
}

const userValidator = new UserValidator();

export { userValidator };
