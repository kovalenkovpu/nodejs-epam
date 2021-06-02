import { UserBase } from '../../user/types/user-dto';

type LoginData = Omit<UserBase, 'age'>;

export type { LoginData };
