import { Sequelize } from 'sequelize/types';

import { Group } from './group';
import { User } from './user';

type IUserModel = typeof User;
type IGroupModel = typeof Group;

interface IDataBase {
  User: IUserModel;
  Group: IGroupModel;
  sequelize: Sequelize;
}

export type { IUserModel, IGroupModel, IDataBase };
