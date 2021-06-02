import { Sequelize } from 'sequelize/types';

import { Group } from './group';
import { User } from './user';

interface IDataBase {
  User: typeof User;
  Group: typeof Group;
  sequelize: Sequelize;
}

export type { IDataBase };
