import { Request, Response } from 'express';

import {
  autosuggestUsersResponse,
  mockUser,
  mockUsers,
  mockUsersWithCompleteData,
  mockUserUpdated,
  userCreationData,
  userUpdateData,
} from '../../__mocks__/user-data';
import * as logUtils from '../../common/utils';
import { mockError, nextFunction } from '../../common/utils/test-utils';
import { iocContainer } from '../../inversify.config';
import { TYPES } from '../../inversify.types';
import {
  AutosuggestUsersQueryParams,
  AutosuggestUsersResponse,
  IUserController,
  UserParams,
} from '../types/user-controller.types';
import { User, UserBase } from '../types/user-dto';
import { IUserService } from '../types/user-service.types';

describe('User Controller tests', () => {
  afterEach(jest.clearAllMocks);

  const userController = iocContainer.get<IUserController>(
    TYPES.UserController
  );
  const userService = iocContainer.get<IUserService>(TYPES.UserService);

  const controllerErrorLoggerSpy = jest
    .spyOn(logUtils, 'controllerErrorLogger')
    // To keep console clear and clean during tests run
    .mockImplementation(() => null);

  describe('"userController.getAll":', () => {
    const res = ({ send: jest.fn() } as unknown) as Response;
    const getAllSpy = jest.spyOn(userService, 'getAll');
    const getAllWithCompleteDataSpy = jest.spyOn(
      userService,
      'getAllWithCompleteData'
    );

    test(`should call "userService.getAll" with correct params
        and resolve with correct data if it's envoked
        with no query parameters`, async () => {
      const req = { query: {} } as Request;

      getAllSpy.mockResolvedValueOnce(mockUsers);

      await userController.getAll(req, res, nextFunction);

      expect(getAllSpy).toBeCalled();
      expect(getAllWithCompleteDataSpy).not.toBeCalled();
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(mockUsers);
    });

    test(`should call "userService.getAllWithCompleteData" with
        correct params and resolve with correct data if it's envoked with
        "withCompleteData" query parameter`, async () => {
      const req = ({
        query: { withCompleteData: 'true' },
      } as unknown) as Request;
      getAllWithCompleteDataSpy.mockResolvedValueOnce(
        mockUsersWithCompleteData
      );

      await userController.getAll(req, res, nextFunction);

      expect(getAllSpy).not.toBeCalled();
      expect(getAllWithCompleteDataSpy).toBeCalled();
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(mockUsersWithCompleteData);
    });

    test(`should call "userService.getAll" with correct params
        and properly reject in case of error:
        - call "controllerErrorLogger" log util with correct params
        - call "next" with thrown error`, async () => {
      const req = { query: {} } as Request;

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

  describe('"userController.getAutoSuggestUsers":', () => {
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
    } as unknown) as Response;

    const getAutoSuggestUsersSpy = jest.spyOn(
      userService,
      'getAutoSuggestUsers'
    );

    test(`should call "userService.getAutoSuggestUsers"
        with correct params and resolve with correct data`, async () => {
      getAutoSuggestUsersSpy.mockResolvedValueOnce(autosuggestUsersResponse);

      await userController.getAutoSuggestUsers(req, res, nextFunction);

      expect(getAutoSuggestUsersSpy).toBeCalledWith(loginSubstring, limit);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(autosuggestUsersResponse);
    });

    test(`should call "userService.getAutoSuggestUsers"
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

  describe('"userController.getOne":', () => {
    const req = { params: { id: mockUser.id } } as Request<UserParams>;
    const res = ({ send: jest.fn() } as unknown) as Response<User>;
    const getOneSpy = jest.spyOn(userService, 'getOne');

    test(`should call "userService.getOne" with correct params
        and resolve with correct data`, async () => {
      getOneSpy.mockResolvedValueOnce(mockUser);

      await userController.getOne(req, res, nextFunction);

      expect(getOneSpy).toBeCalledWith(mockUser.id);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(mockUser);
    });

    test(`should call "userService.getOne" with correct params
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

  describe('"userController.create":', () => {
    const req = { body: userCreationData } as Request;
    const res = ({ send: jest.fn() } as unknown) as Response;
    const createSpy = jest.spyOn(userService, 'create');

    test(`should call "userService.create" with correct params
        and resolve with correct data`, async () => {
      createSpy.mockResolvedValueOnce(mockUser);

      await userController.create(req, res, nextFunction);

      expect(createSpy).toBeCalledWith(userCreationData);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(mockUser);
    });

    test(`should call "userService.create" with correct params
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

  describe('"userController.update":', () => {
    const req = {
      params: { id: mockUser.id },
      body: userUpdateData,
    } as Request<UserParams, User, UserBase>;
    const res = ({ send: jest.fn() } as unknown) as Response;
    const updateSpy = jest.spyOn(userService, 'update');

    test(`should call "userService.update" with correct params
        and resolve with correct data`, async () => {
      updateSpy.mockResolvedValueOnce(mockUserUpdated);

      await userController.update(req, res, nextFunction);

      expect(updateSpy).toBeCalledWith(mockUser.id, userUpdateData);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(mockUserUpdated);
    });

    test(`should call "userService.update" with correct params
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

  describe('"userController.delete":', () => {
    const req = {
      params: { id: mockUser.id },
    } as Request<UserParams>;
    const res = ({ send: jest.fn() } as unknown) as Response;
    const deleteSpy = jest.spyOn(userService, 'delete');

    test(`should call "userService.delete" with correct params
        and resolve with correct data`, async () => {
      deleteSpy.mockResolvedValueOnce(mockUser);

      await userController.delete(req, res, nextFunction);

      expect(deleteSpy).toBeCalledWith(mockUser.id);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(
        `User with id: ${mockUser.id} successfully deleted`
      );
    });

    test(`should call "userService.delete" with correct params
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
