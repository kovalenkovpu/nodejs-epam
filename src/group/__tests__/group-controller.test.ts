import { Request, Response } from 'express';
import { Container } from 'inversify';

import {
  mockGroup,
  mockGroups,
  groupUpdateData,
  groupCreationData,
  mockGroupUpdated,
  groupWithAssignedUsers,
} from '../../__mocks__/group-data';
import { MockGroupService } from '../../__mocks__/group-service';
import { mockUser } from '../../__mocks__/user-data';
import * as logUtils from '../../common/utils';
import { mockError, nextFunction } from '../../common/utils/test-utils';
import { TYPES } from '../../inversify.types';
import { GroupController } from '../group-controller';
import {
  AddUserToGroupRequestBody,
  GroupParams,
  IGroupController,
} from '../types/group-controller.types';
import { Group, GroupBase } from '../types/group-dto';
import { IGroupService } from '../types/group-service.types';

describe('Group Controller tests', () => {
  const container = new Container();
  container.bind<IGroupController>(TYPES.GroupController).to(GroupController);
  container
    .bind<IGroupService>(TYPES.GroupService)
    .to(MockGroupService)
    .inSingletonScope();

  afterEach(jest.clearAllMocks);

  const groupController = container.get<IGroupController>(
    TYPES.GroupController
  );
  const groupService = container.get<IGroupService>(TYPES.GroupService);

  const controllerErrorLoggerSpy = jest
    .spyOn(logUtils, 'controllerErrorLogger')
    // To keep console clear and clean during tests run
    .mockImplementation(() => null);

  describe('Tests for "groupController.getAll":', () => {
    const res = ({ send: jest.fn() } as unknown) as Response<Group[]>;
    const getAllSpy = jest.spyOn(groupService, 'getAll');

    test(`"getAll" should call "groupService.getAll" with correct params
        and resolve with correct data`, async () => {
      const req = { query: {} } as Request<unknown, Group[]>;

      getAllSpy.mockResolvedValueOnce(mockGroups);

      await groupController.getAll(req, res, nextFunction);

      expect(getAllSpy).toBeCalled();
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(mockGroups);
    });

    test(`"getAll" should call "groupService.getAll" with correct params
        and properly reject in case of error:
        - call "controllerErrorLogger" log util with correct params
        - call "next" with thrown error`, async () => {
      const req = { query: {} } as Request<unknown, Group[]>;

      getAllSpy.mockRejectedValueOnce(mockError);

      try {
        await groupController.getAll(req, res, nextFunction);
      } catch (error) {
        expect(getAllSpy).toBeCalled();
        expect(res.send).not.toBeCalled();
        expect(controllerErrorLoggerSpy).toBeCalledWith({
          controllerName: 'GroupController',
          methodName: 'getAll',
          args: req.params,
          error: mockError,
        });
        expect(nextFunction).toBeCalledWith(mockError);
      }
    });
  });

  describe('Tests for "groupController.getOne":', () => {
    const req = { params: { id: mockGroup.id } } as Request<GroupParams>;
    const res = ({ send: jest.fn() } as unknown) as Response<Group>;
    const getOneSpy = jest.spyOn(groupService, 'getOne');

    test(`"getOne" should call "groupService.getOne" with correct params
        and resolve with correct data`, async () => {
      getOneSpy.mockResolvedValueOnce(mockGroup);

      await groupController.getOne(req, res, nextFunction);

      expect(getOneSpy).toBeCalledWith(mockGroup.id);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(mockGroup);
    });

    test(`"getOne" should call "groupService.getOne" with correct params
        and properly reject in case of error:
        - call "controllerErrorLogger" log util with correct params
        - call "next" with thrown error`, async () => {
      getOneSpy.mockRejectedValueOnce(mockError);

      try {
        await groupController.getOne(req, res, nextFunction);
      } catch (error) {
        expect(getOneSpy).toBeCalledWith(mockGroup.id);
        expect(res.send).not.toBeCalled();
        expect(controllerErrorLoggerSpy).toBeCalledWith({
          controllerName: 'GroupController',
          methodName: 'getOne',
          args: req.params,
          error: mockError,
        });
        expect(nextFunction).toBeCalledWith(mockError);
      }
    });
  });

  describe('Tests for "groupController.create":', () => {
    const req = { body: groupCreationData } as Request<
      unknown,
      Group,
      GroupBase
    >;
    const res = ({ send: jest.fn() } as unknown) as Response<Group>;
    const createSpy = jest.spyOn(groupService, 'create');

    test(`"create" should call "groupService.create" with correct params
        and resolve with correct data`, async () => {
      createSpy.mockResolvedValueOnce(mockGroup);

      await groupController.create(req, res, nextFunction);

      expect(createSpy).toBeCalledWith(groupCreationData);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(mockGroup);
    });

    test(`"create" should call "groupService.create" with correct params
        and properly reject in case of error:
        - call "controllerErrorLogger" log util with correct params
        - call "next" with thrown error`, async () => {
      createSpy.mockRejectedValueOnce(mockError);

      try {
        await groupController.create(req, res, nextFunction);
      } catch (error) {
        expect(createSpy).toBeCalledWith(groupCreationData);
        expect(res.send).not.toBeCalled();
        expect(controllerErrorLoggerSpy).toBeCalledWith({
          controllerName: 'GroupController',
          methodName: 'create',
          args: req.params,
          error: mockError,
        });
        expect(nextFunction).toBeCalledWith(mockError);
      }
    });
  });

  describe('Tests for "groupController.update":', () => {
    const req = {
      params: { id: mockGroup.id },
      body: groupUpdateData,
    } as Request<GroupParams, Group, GroupBase>;
    const res = ({ send: jest.fn() } as unknown) as Response<Group>;
    const updateSpy = jest.spyOn(groupService, 'update');

    test(`"update" should call "groupService.update" with correct params
        and resolve with correct data`, async () => {
      updateSpy.mockResolvedValueOnce(mockGroupUpdated);

      await groupController.update(req, res, nextFunction);

      expect(updateSpy).toBeCalledWith(mockGroup.id, groupUpdateData);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(mockGroupUpdated);
    });

    test(`"update" should call "groupService.update" with correct params
        and properly reject in case of error:
        - call "controllerErrorLogger" log util with correct params
        - call "next" with thrown error`, async () => {
      updateSpy.mockRejectedValueOnce(mockError);

      try {
        await groupController.update(req, res, nextFunction);
      } catch (error) {
        expect(updateSpy).toBeCalledWith(groupUpdateData);
        expect(res.send).not.toBeCalled();
        expect(controllerErrorLoggerSpy).toBeCalledWith({
          controllerName: 'GroupController',
          methodName: 'update',
          args: req.params,
          error: mockError,
        });
        expect(nextFunction).toBeCalledWith(mockError);
      }
    });
  });

  describe('Tests for "groupController.delete":', () => {
    const req = {
      params: { id: mockGroup.id },
    } as Request<GroupParams>;
    const res = ({ send: jest.fn() } as unknown) as Response<string>;
    const deleteSpy = jest.spyOn(groupService, 'delete');

    test(`"delete" should call "groupService.delete" with correct params
        and resolve with correct data`, async () => {
      deleteSpy.mockResolvedValueOnce(mockGroup);

      await groupController.delete(req, res, nextFunction);

      expect(deleteSpy).toBeCalledWith(mockGroup.id);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(
        `Group with id: ${mockGroup.id} successfully deleted`
      );
    });

    test(`"delete" should call "groupService.delete" with correct params
        and properly reject in case of error:
        - call "controllerErrorLogger" log util with correct params
        - call "next" with thrown error`, async () => {
      deleteSpy.mockRejectedValueOnce(mockError);

      try {
        await groupController.delete(req, res, nextFunction);
      } catch (error) {
        expect(deleteSpy).toBeCalledWith(mockGroup.id);
        expect(res.send).not.toBeCalled();
        expect(controllerErrorLoggerSpy).toBeCalledWith({
          controllerName: 'GroupController',
          methodName: 'delete',
          args: req.params,
          error: mockError,
        });
        expect(nextFunction).toBeCalledWith(mockError);
      }
    });
  });

  describe('Tests for "groupController.addUsersToGroup":', () => {
    const usersIds = [mockUser.id];
    const req = {
      params: { id: mockGroup.id },
      body: { usersIds },
    } as Request<GroupParams, Group, AddUserToGroupRequestBody>;
    const res = ({ send: jest.fn() } as unknown) as Response<Group>;
    const addUsersToGroupSpy = jest.spyOn(groupService, 'addUsersToGroup');

    test(`"addUsersToGroup" should call "groupService.addUsersToGroup" with
        correct params and resolve with correct data`, async () => {
      addUsersToGroupSpy.mockResolvedValueOnce(groupWithAssignedUsers);

      await groupController.addUsersToGroup(req, res, nextFunction);

      expect(addUsersToGroupSpy).toBeCalledWith(mockGroup.id, usersIds);
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith(groupWithAssignedUsers);
    });

    test(`"addUsersToGroup" should call "groupService.addUsersToGroup" with
        correct params and properly reject in case of error:
        - call "controllerErrorLogger" log util with correct params
        - call "next" with thrown error`, async () => {
      addUsersToGroupSpy.mockRejectedValueOnce(mockError);

      try {
        await groupController.addUsersToGroup(req, res, nextFunction);
      } catch (error) {
        expect(addUsersToGroupSpy).toBeCalledWith(mockGroup.id, usersIds);
        expect(res.send).not.toBeCalled();
        expect(controllerErrorLoggerSpy).toBeCalledWith({
          controllerName: 'GroupController',
          methodName: 'addUsersToGroup',
          args: req.params,
          error: mockError,
        });
        expect(nextFunction).toBeCalledWith(mockError);
      }
    });
  });
});
