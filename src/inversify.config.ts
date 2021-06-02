import { Container } from 'inversify';

// import db from '../db/models';

// import { IDataBase } from './common/types/db-types';
// import { TYPES } from './types';
// import { IUserService } from './user/types/user-service.types';
// import { UserService } from './user/user-service';

const myContainer = new Container();

// myContainer.bind<IUserService>(TYPES.UserService).to(UserService);
// myContainer
// .bind<IDataBase['User']>(TYPES.UserModel)
// // @ts-ignore
// .to(db.User);

export { myContainer };
