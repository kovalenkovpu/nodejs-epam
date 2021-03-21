import { Request, Response } from 'express';

import { User, UserDTO, UserId } from '../user-dto';

interface AutosuggestUsersQueryParams {
	loginSubstring?: string;
	limit?: string;
}

interface UserParams {
	id: UserId;
}

interface IUserController {
	getAll: (req: Request, res: Response<UserDTO[]>) => void;

	getAutoSuggestUsers: (
		req: Request<{}, UserDTO[], any, AutosuggestUsersQueryParams>,
		res: Response<UserDTO[]>
	) => void;

	getOne: (req: Request<UserParams>, res: Response<UserDTO | string>) => void;

	create: (req: Request<{}, UserDTO, User>, res: Response<UserDTO>) => void;

	update: (
		req: Request<UserParams, UserDTO, User>,
		res: Response<UserDTO | string>
	) => void;

	delete: (req: Request<UserParams>, res: Response<UserDTO | string>) => void;
}

export type { IUserController, AutosuggestUsersQueryParams, UserParams };
