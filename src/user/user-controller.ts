import { Request, Response } from 'express';

import { IUserController } from './types/user-controller.types';
import { UserParams, User, UserDTO } from './user-dto';
import { userService } from './user-service';

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

	getOne = (req: Request<UserParams>, res: Response<UserDTO | string>) => {
		try {
			const { id } = req.params;
			const currentUser = userService.getOne(id);

			if (currentUser) {
				res.send(currentUser);
			}

			const errorMessage = this.generateNotFoundMessage(id);

			res.status(404).json(errorMessage);
		} catch (error) {
			res.status(500).json(error);
		}
	};

	create = (req: Request<{}, UserDTO, User>, res: Response<UserDTO>) => {
		try {
			const user = userService.create(req.body);

			res.send(user);
		} catch (error) {
			res.status(500).json(error);
		}
	};

	update = (
		req: Request<UserParams, UserDTO, User>,
		res: Response<UserDTO | string>
	) => {
		try {
			const { id } = req.params;
			const updatedUser = userService.update(id, req.body);

			if (updatedUser) {
				res.send(updatedUser);
			}

			const errorMessage = this.generateNotFoundMessage(id);

			res.status(404).json(errorMessage);
		} catch (error) {
			res.status(500).json(error);
		}
	};

	delete = (req: Request<UserParams>, res: Response<UserDTO | string>) => {
		try {
			const { id } = req.params;
			const currentUser = userService.delete(id);

			if (currentUser) {
				res.send(currentUser);
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
