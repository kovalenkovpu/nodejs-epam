import { Model, Optional } from 'sequelize/types';

import { UserDTO } from '../../user/types/user-dto';

type UserCreationAttributes = Optional<UserDTO, 'id' | 'isDeleted'>;

interface UserInstance
  extends Model<UserDTO, UserCreationAttributes>,
    UserDTO {}

export type { UserCreationAttributes, UserInstance };
