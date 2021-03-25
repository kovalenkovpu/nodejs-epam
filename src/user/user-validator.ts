import { ValidationError } from 'joi';

import {
	FormatterValidationError,
	IUserValidator,
} from './types/user-validator.types';
import { User, UserDTO } from './types/user-dto';
import { userLoginSchema, userSchema } from './user-schema';

class UserValidator implements IUserValidator {
	formatError = ({ details }: ValidationError) => {
		return details.map<FormatterValidationError>(({ message, path }) => ({
			message,
			path,
		}));
	};

	validateUser = (newUser: User) => {
		// For TS purposes - Joi's "validateASync" returns "Promise<any>"
		return userSchema.validateAsync(newUser, {
			abortEarly: false,
		}) as Promise<User>;
	};

	validateUserUnique = (existingUsers: UserDTO[], newUser: User) => {
		return userLoginSchema.validateAsync([...existingUsers, newUser], {
			abortEarly: false,
		});
	};
}

const userValidator = new UserValidator();

export { userValidator };
