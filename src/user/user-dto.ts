interface User {
	login: string;
	password: string;
	age: number;
}

type UserId = string;

interface UserDTO extends User {
	id: UserId;
	isDeleted: boolean;
}

interface UserParams {
	id: UserId;
}

export type { UserParams, User, UserDTO, UserId };
