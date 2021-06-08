import { Request, Response } from 'express';
import { Container } from 'inversify';

import {
  autosuggestUsersResponse,
  mockUser,
  mockUsers,
  mockUsersWithCompleteData,
  mockUserUpdated,
  userCreationData,
  userUpdateData,
} from '../../__mocks__/user-data';
import { MockUserService } from '../../__mocks__/user-service';
import * as logUtils from '../../common/utils';
import { mockError, nextFunction } from '../../common/utils/test-utils';
import { TYPES } from '../../inversify.types';
import {
  AutosuggestUsersQueryParams,
  AutosuggestUsersResponse,
  GetAllUsersQueryParams,
  IUserController,
  UserParams,
} from '../types/user-controller.types';
import { User, UserBase, UserDTO } from '../types/user-dto';
import { IUserService } from '../types/user-service.types';
import { UserController } from '../user-controller';

describe('User Controller tests', () => {
  const container = new Container();
  container.bind<IUserController>(TYPES.UserController).to(UserController);
  container
    .bind<IUserService>(TYPES.UserService)
    .to(MockUserService)
    .inSingletonScope();

  afterEach(jest.clearAllMocks);

  const userController = container.get<IUserController>(TYPES.UserController);
  const userService = container.get<IUserService>(TYPES.UserService);

  const controllerErrorLoggerSpy = jest
    .spyOn(logUtils, 'controllerErrorLogger')
    // To keep console clear and clean during tests run
    .mockImplementation(() => null);

  describe('Tests for "userController.getAll":', () => {
    const res = ({ send: jest.fn() } as unknown) as Response<
      User[] | UserDTO[]
    >;
    const getAllSpy = jest.spyOn(userService, 'getAll');
    const getAllWithCompleteDataSpy = jest.spyOn(
      userService,
      'getAllWithCompleteData'
    );

    test(`"getAll" should call "userService.getAll" with correct params
        and resolve with correct data if it's envoked
        with no query parameters`, async () => {
      const req = { query: {} } as Request<
        unknown,
        User[] | UserDTO[],
        any,
        GetAllUsersQueryParams
      >;

      getAllSpy.mockResolvedValueOnce(mockUsers);

      await userController.getAll(req, res, nextFunction);

      expect(getAllSpy).toBeCalled();
      expect(getAllWithCompleteDataSpy).not.toBeCalled();
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(mockUsers);
    });

    test(`"getAll" should call "userService.getAllWithCompleteData" with
        correct params and resolve with correct data if it's envoked with
        "withCompleteData" query parameter`, async () => {
      const req = ({
        query: { withCompleteData: 'true' },
      } as unknown) as Request<
        unknown,
        User[] | UserDTO[],
        any,
        GetAllUsersQueryParams
      >;
      getAllWithCompleteDataSpy.mockResolvedValueOnce(
        mockUsersWithCompleteData
      );

      await userController.getAll(req, res, nextFunction);

      expect(getAllSpy).not.toBeCalled();
      expect(getAllWithCompleteDataSpy).toBeCalled();
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(mockUsersWithCompleteData);
    });

    test(`"getAll" should call "userService.getAll" with correct params
        and properly reject in case of error:
        - call "controllerErrorLogger" log util with correct params
        - call "next" with thrown error`, async () => {
      const req = { query: {} } as Request<
        unknown,
        User[] | UserDTO[],
        any,
        GetAllUsersQueryParams
      >;

      getAllSpy.mockRejectedValueOnce(mockError);

      try {
        await userController.getAll(req, res, nextFunction);
      } catch (error) {
        expect(getAllSpy).toBeCalled();
        expect(res.send).not.toBeCalled();
        expect(controllerErrorLoggerSpy).toBeCalledWith({
          controllerName: 'UserController',
          methodName: 'getAll',
          args: req.params,
          error: mockError,
        });
        expect(nextFunction).toBeCalledWith(mockError);
      }
    });
  });

  describe('Tests for "userController.getAutoSuggestUsers":', () => {
    const loginSubstring = 'petr';
    const limit = 10;
    const req = { query: { loginSubstring, limit } } as Request<
      unknown,
      AutosuggestUsersResponse,
      undefined,
      AutosuggestUsersQueryParams
    >;
    const res = ({
      send: jest.fn(),
    } as unknown) as Response<AutosuggestUsersResponse>;

    const getAutoSuggestUsersSpy = jest.spyOn(
      userService,
      'getAutoSuggestUsers'
    );

    test(`"getAutoSuggestUsers" should call "userService.getAutoSuggestUsers"
        with correct params and resolve with correct data`, async () => {
      getAutoSuggestUsersSpy.mockResolvedValueOnce(autosuggestUsersResponse);

      await userController.getAutoSuggestUsers(req, res, nextFunction);

      expect(getAutoSuggestUsersSpy).toBeCalledWith(loginSubstring, limit);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(autosuggestUsersResponse);
    });

    test(`"getAutoSuggestUsers" should call "userService.getAutoSuggestUsers"
        with correct params and properly reject in case of error:
        - call "controllerErrorLogger" log util with correct params
        - call "next" with thrown error`, async () => {
      getAutoSuggestUsersSpy.mockRejectedValueOnce(mockError);

      try {
        await userController.getAutoSuggestUsers(req, res, nextFunction);
      } catch (error) {
        expect(getAutoSuggestUsersSpy).toBeCalledWith(loginSubstring, limit);
        expect(res.send).not.toBeCalled();
        expect(controllerErrorLoggerSpy).toBeCalledWith({
          controllerName: 'UserController',
          methodName: 'getAutoSuggestUsers',
          args: req.params,
          error: mockError,
        });
        expect(nextFunction).toBeCalledWith(mockError);
      }
    });
  });

  describe('Tests for "userController.getOne":', () => {
    const req = { params: { id: mockUser.id } } as Request<UserParams>;
    const res = ({ send: jest.fn() } as unknown) as Response<User>;
    const getOneSpy = jest.spyOn(userService, 'getOne');

    test(`"getOne" should call "userService.getOne" with correct params
        and resolve with correct data`, async () => {
      getOneSpy.mockResolvedValueOnce(mockUser);

      await userController.getOne(req, res, nextFunction);

      expect(getOneSpy).toBeCalledWith(mockUser.id);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(mockUser);
    });

    test(`"getOne" should call "userService.getOne" with correct params
        and properly reject in case of error:
        - call "controllerErrorLogger" log util with correct params
        - call "next" with thrown error`, async () => {
      getOneSpy.mockRejectedValueOnce(mockError);

      try {
        await userController.getOne(req, res, nextFunction);
      } catch (error) {
        expect(getOneSpy).toBeCalledWith(mockUser.id);
        expect(res.send).not.toBeCalled();
        expect(controllerErrorLoggerSpy).toBeCalledWith({
          controllerName: 'UserController',
          methodName: 'getOne',
          args: req.params,
          error: mockError,
        });
        expect(nextFunction).toBeCalledWith(mockError);
      }
    });
  });

  describe('Tests for "userController.create":', () => {
    const req = { body: userCreationData } as Request<unknown, User, UserBase>;
    const res = ({ send: jest.fn() } as unknown) as Response<User>;
    const createSpy = jest.spyOn(userService, 'create');

    test(`"create" should call "userService.create" with correct params
        and resolve with correct data`, async () => {
      createSpy.mockResolvedValueOnce(mockUser);

      await userController.create(req, res, nextFunction);

      expect(createSpy).toBeCalledWith(userCreationData);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(mockUser);
    });

    test(`"create" should call "userService.create" with correct params
        and properly reject in case of error:
        - call "controllerErrorLogger" log util with correct params
        - call "next" with thrown error`, async () => {
      createSpy.mockRejectedValueOnce(mockError);

      try {
        await userController.create(req, res, nextFunction);
      } catch (error) {
        expect(createSpy).toBeCalledWith(userCreationData);
        expect(res.send).not.toBeCalled();
        expect(controllerErrorLoggerSpy).toBeCalledWith({
          controllerName: 'UserController',
          methodName: 'create',
          args: req.params,
          error: mockError,
        });
        expect(nextFunction).toBeCalledWith(mockError);
      }
    });
  });

  describe('Tests for "userController.update":', () => {
    const req = {
      params: { id: mockUser.id },
      body: userUpdateData,
    } as Request<UserParams, User, UserBase>;
    const res = ({ send: jest.fn() } as unknown) as Response<User>;
    const updateSpy = jest.spyOn(userService, 'update');

    test(`"update" should call "userService.update" with correct params
        and resolve with correct data`, async () => {
      updateSpy.mockResolvedValueOnce(mockUserUpdated);

      await userController.update(req, res, nextFunction);

      expect(updateSpy).toBeCalledWith(mockUser.id, userUpdateData);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(mockUserUpdated);
    });

    test(`"update" should call "userService.update" with correct params
        and properly reject in case of error:
        - call "controllerErrorLogger" log util with correct params
        - call "next" with thrown error`, async () => {
      updateSpy.mockRejectedValueOnce(mockError);

      try {
        await userController.update(req, res, nextFunction);
      } catch (error) {
        expect(updateSpy).toBeCalledWith(userUpdateData);
        expect(res.send).not.toBeCalled();
        expect(controllerErrorLoggerSpy).toBeCalledWith({
          controllerName: 'UserController',
          methodName: 'update',
          args: req.params,
          error: mockError,
        });
        expect(nextFunction).toBeCalledWith(mockError);
      }
    });
  });

  describe('Tests for "userController.delete":', () => {
    const req = {
      params: { id: mockUser.id },
    } as Request<UserParams>;
    const res = ({ send: jest.fn() } as unknown) as Response<string>;
    const deleteSpy = jest.spyOn(userService, 'delete');

    test(`"delete" should call "userService.delete" with correct params
        and resolve with correct data`, async () => {
      deleteSpy.mockResolvedValueOnce(mockUser);

      await userController.delete(req, res, nextFunction);

      expect(deleteSpy).toBeCalledWith(mockUser.id);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(
        `User with id: ${mockUser.id} successfully deleted`
      );
    });

    test(`"delete" should call "userService.delete" with correct params
        and properly reject in case of error:
        - call "controllerErrorLogger" log util with correct params
        - call "next" with thrown error`, async () => {
      deleteSpy.mockRejectedValueOnce(mockError);

      try {
        await userController.delete(req, res, nextFunction);
      } catch (error) {
        expect(deleteSpy).toBeCalledWith(mockUser.id);
        expect(res.send).not.toBeCalled();
        expect(controllerErrorLoggerSpy).toBeCalledWith({
          controllerName: 'UserController',
          methodName: 'delete',
          args: req.params,
          error: mockError,
        });
        expect(nextFunction).toBeCalledWith(mockError);
      }
    });
  });
});
