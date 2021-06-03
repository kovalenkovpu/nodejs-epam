import { Container } from 'inversify';
import 'reflect-metadata';
import { Sequelize } from 'sequelize/types';

import dataBase from '../db/models';
import { IUserModel, IGroupModel } from '../db/models/types';

import { GroupController } from './group/group-controller';
import { GroupService } from './group/group-service';
import { IGroupController } from './group/types/group-controller.types';
import { IGroupService } from './group/types/group-service.types';
import { TYPES } from './types';
import { IUserController } from './user/types/user-controller.types';
import { IUserService } from './user/types/user-service.types';
import { UserController } from './user/user-controller';
import { UserService } from './user/user-service';

const iocContainer = new Container();

iocContainer.bind<IUserService>(TYPES.UserService).to(UserService);
iocContainer.bind<IUserController>(TYPES.UserController).to(UserController);
iocContainer.bind<IGroupService>(TYPES.GroupService).to(GroupService);
iocContainer.bind<IGroupController>(TYPES.GroupController).to(GroupController);
iocContainer.bind<IUserModel>(TYPES.UserModel).toConstantValue(dataBase.User);
iocContainer
  .bind<IGroupModel>(TYPES.GroupModel)
  .toConstantValue(dataBase.Group);
iocContainer
  .bind<Sequelize>(TYPES.Sequelize)
  .toConstantValue(dataBase.sequelize);

export { iocContainer };
