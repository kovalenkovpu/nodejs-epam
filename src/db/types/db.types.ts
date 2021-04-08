import { ModelCtor, Sequelize } from 'sequelize/types';

import { UserInstance } from '../models/user';

interface IDB {
  sequelize: Sequelize;
  initDBConnenction: () => Promise<void>;
  User: ModelCtor<UserInstance>;
}

interface InitDBConnenction {
  (): Promise<void>;
}

export type { IDB, InitDBConnenction };
