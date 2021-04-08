import { ModelCtor, Sequelize } from 'sequelize/types';

import { UserInstance } from './user-model.types';

interface IDB {
  sequelize: Sequelize;
  initDBConnenction: () => Promise<void>;
  User: ModelCtor<UserInstance>;
}

interface InitDBConnenction {
  (): Promise<void>;
}

export type { IDB, InitDBConnenction };
