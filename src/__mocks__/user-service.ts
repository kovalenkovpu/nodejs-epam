import { injectable } from 'inversify';

import 'reflect-metadata';
import { AutosuggestUsersResponse } from '../user/types/user-controller.types';
import { User } from '../user/types/user-dto';
import { IUserService } from '../user/types/user-service.types';

import { mockUser } from './user-data';

@injectable()
class MockUserService implements IUserService {
  getAll = async (): Promise<User[]> => Promise.resolve([mockUser]);
  getAllWithCompleteData = (): Promise<User[]> => Promise.resolve([mockUser]);
  getAutoSuggestUsers = (): Promise<AutosuggestUsersResponse> =>
    Promise.resolve({
      totalCount: 1,
      users: [mockUser],
    });
  findOneByCredentials = (): Promise<User | undefined> =>
    Promise.resolve(mockUser);
  create = (): Promise<User | undefined> => Promise.resolve(mockUser);
  update = (): Promise<User | undefined> => Promise.resolve(mockUser);
  delete = (): Promise<User | undefined> => Promise.resolve(mockUser);
  getOne = (): Promise<User | undefined> => Promise.resolve(mockUser);
}

export { MockUserService };
