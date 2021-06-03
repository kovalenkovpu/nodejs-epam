import { Container } from 'inversify';
import 'reflect-metadata';
import { Sequelize } from 'sequelize/types';

import dataBase from '../db/models';
import { IUserModel, IGroupModel } from '../db/models/types';

import { GroupService } from './group/group-service';
import { IGroupService } from './group/types/group-service.types';
import { TYPES } from './types';
import { IUserService } from './user/types/user-service.types';
import { UserService } from './user/user-service';

const iocContainer = new Container();

iocContainer.bind<IUserService>(TYPES.UserService).to(UserService);
iocContainer.bind<IGroupService>(TYPES.UserService).to(GroupService);
iocContainer.bind<IUserModel>(TYPES.UserModel).toConstantValue(dataBase.User);
iocContainer
  .bind<IGroupModel>(TYPES.GroupModel)
  .toConstantValue(dataBase.Group);
iocContainer
  .bind<Sequelize>(TYPES.Sequelize)
  .toConstantValue(dataBase.sequelize);

export { iocContainer };
