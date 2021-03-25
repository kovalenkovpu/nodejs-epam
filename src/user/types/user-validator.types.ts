import { ValidationError, ValidationErrorItem } from 'joi';

import { User, UserDTO } from './user-dto';

interface FormatterValidationError {
	message: ValidationErrorItem['message'];
	path: ValidationErrorItem['path'];
}

interface IUserValidator {
	formatError: (error: ValidationError) => FormatterValidationError[];

	validateUser: (newUser: User) => Promise<User>;

	validateUserUnique: (existingUsers: UserDTO[], newUser: User) => Promise<any>;
}

export type { IUserValidator, FormatterValidationError };
