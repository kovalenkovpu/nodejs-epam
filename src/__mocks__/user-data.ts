import { AutosuggestUsersResponse } from '../user/types/user-controller.types';
import { User, UserBase, UserDTO } from '../user/types/user-dto';

const userCreationData: UserBase = {
  login: 'petr',
  password: 'pass123',
  age: 35,
};

const userUpdateData: UserBase = {
  login: 'petrov',
  password: 'pass1234',
  age: 34,
};

const mockUser: User = {
  id: 'b669941f-925a-4a8e-9ddc-03b0facc4ac1',
  ...userCreationData,
};

const mockUserUpdated: User = {
  id: 'b669941f-925a-4a8e-9ddc-03b0facc4ac1',
  ...userUpdateData,
};

const mockUserWithCompleteData: UserDTO = {
  ...mockUser,
  isDeleted: false,
  createdAt: '2021-01-06T11:06:00.752Z',
  updatedAt: '2021-06-07T13:36:20.752Z',
};

const mockUsers = [mockUser];
const mockUsersWithCompleteData = [mockUserWithCompleteData];

const autosuggestUsersResponse: AutosuggestUsersResponse = {
  totalCount: 100,
  users: mockUsers,
};

export {
  userCreationData,
  userUpdateData,
  mockUser,
  mockUserUpdated,
  mockUsers,
  mockUserWithCompleteData,
  mockUsersWithCompleteData,
  autosuggestUsersResponse,
};
