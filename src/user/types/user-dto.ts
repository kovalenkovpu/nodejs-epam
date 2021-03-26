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

export type { User, UserDTO, UserId };
