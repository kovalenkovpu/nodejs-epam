import { ModelCtor, Sequelize } from 'sequelize/types';

import { UserInstance } from './user-model.types';

interface IDB {
  sequelize: Sequelize;
  User: ModelCtor<UserInstance>;
}

export type { IDB };
