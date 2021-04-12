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
  createdAt?: Date;
  updatedAt?: Date;
}

// Send to FE
type User = Omit<UserDTO, 'isDeleted' | 'createdAt' | 'updatedAt'>;

export type { UserBase, UserDTO, User, UserId };
