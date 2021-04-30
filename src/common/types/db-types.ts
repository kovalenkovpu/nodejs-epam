import { ModelCtor, Sequelize } from 'sequelize/types';

import { GroupInstance } from '../../group/types/group-model.types';
import { UserInstance } from '../../user/types/user-model.types';

interface IDataBase {
  User: ModelCtor<UserInstance>;
  Group: ModelCtor<GroupInstance>;
  sequelize: Sequelize;
}

export type { IDataBase };
