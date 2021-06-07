// Receive from FE
type UserLogin = string;
type UserPassword = string;

interface UserBase {
  login: UserLogin;
  password: UserPassword;
  age: number;
}

type UserId = string;

// Work internally on BE
interface UserDTO extends UserBase {
  id: UserId;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Send to FE
type User = Omit<UserDTO, 'isDeleted' | 'createdAt' | 'updatedAt'>;

export type { UserLogin, UserPassword, UserBase, UserDTO, User, UserId };
