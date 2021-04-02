// Receive from FE
interface UserBase {
  login: string;
  password: string;
  age: number;
}

type UserId = string;

// Work internally on BE
interface UserDTO extends UserBase {
  id: UserId;
  isDeleted: boolean;
}

// Send to FE
type User = Omit<UserDTO, 'isDeleted'>;

export type { UserBase, UserDTO, User, UserId };
