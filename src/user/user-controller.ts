import { Request, Response } from 'express';

import {
	AutosuggestUsersQueryParams,
	IUserController,
	UserParams,
} from './types/user-controller.types';
import { User, UserDTO } from './types/user-dto';
import { FormatterValidationError } from './types/user-validator.types';
import { userService } from './user-service';
import { userValidator } from './user-validator';

class UserController implements IUserController {
	private generateNotFoundMessage = (id: string) =>
		`User with id: ${id} not found`;

	getAll = (req: Request, res: Response<UserDTO[]>) => {
		try {
			res.send(userService.getAll());
		} catch (error) {
			res.status(500).json(error);
		}
	};

	getAutoSuggestUsers = (
		req: Request<{}, UserDTO[], any, AutosuggestUsersQueryParams>,
		res: Response<UserDTO[]>
	) => {
		try {
			const { loginSubstring, limit } = req.query;

			const suggestedUsers = userService.getAutoSuggestUsers(
				loginSubstring,
				limit
			);

			res.send(suggestedUsers);
		} catch (error) {
			res.status(500).json(error);
		}
	};

	getOne = (req: Request<UserParams>, res: Response<UserDTO | string>) => {
		try {
			const { id } = req.params;
			const currentUser = userService.getOne(id);

			if (currentUser) {
				return res.send(currentUser);
			}

			const errorMessage = this.generateNotFoundMessage(id);

			res.status(404).json(errorMessage);
		} catch (error) {
			res.status(500).json(error);
		}
	};

	create = async (
		req: Request<{}, UserDTO, User>,
		res: Response<UserDTO | FormatterValidationError[]>
	) => {
		try {
			const { body: newUserData } = req;
			const userData = await userValidator.validateUser(newUserData);

			const existingUsers = userService.getAll();
			await userValidator.validateUserUnique(existingUsers, newUserData);

			const user = userService.create(userData);

			res.send(user);
		} catch (error) {
			res.status(400).json(userValidator.formatError(error));
		}
	};

	update = async (
		req: Request<UserParams, UserDTO, User>,
		res: Response<UserDTO | FormatterValidationError[] | string>
	) => {
		try {
			const {
				params: { id },
				body: newUserData,
			} = req;

			const userData = await userValidator.validateUser(newUserData);

			const existingUsers = userService.getAll();
			await userValidator.validateUserUnique(existingUsers, newUserData);

			const updatedUser = userService.update(id, userData);

			if (updatedUser) {
				return res.send(updatedUser);
			}

			const errorMessage = this.generateNotFoundMessage(id);

			// "return" is for TS more clear typings
			return res.status(404).json(errorMessage);
		} catch (error) {
			return res.status(400).json(userValidator.formatError(error));
		}
	};

	delete = (req: Request<UserParams>, res: Response<UserDTO | string>) => {
		try {
			const { id } = req.params;
			const deletedUser = userService.delete(id);

			if (deletedUser) {
				return res.send(`User with id: ${id} successfully deleted`);
			}

			const errorMessage = this.generateNotFoundMessage(id);

			res.status(404).json(errorMessage);
		} catch (error) {
			res.status(500).json(error);
		}
	};
}

const userController = new UserController();

export { userController };
