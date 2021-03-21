import { Request, Response } from 'express';

import { User, UserDTO, UserId, UserParams } from '../user-dto';

interface IUserService {
	getAll: () => UserDTO[];

	getOne: (id: UserId) => UserDTO | undefined;

	create: (user: User) => UserDTO | undefined;

	update: (id: UserId, user: User) => UserDTO | undefined;

	delete: (id: UserId) => UserDTO | undefined;
}

export type { IUserService };
