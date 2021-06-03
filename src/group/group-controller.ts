import { NextFunction, Request, Response } from 'express';

import { controllerErrorLogger, executionTimeTracker } from '../common/utils';
import { iocContainer } from '../inversify.config';

import { GroupService } from './group-service';
import {
  IGroupController,
  GroupParams,
  AddUserToGroupRequestBody,
} from './types/group-controller.types';
import { Group, GroupBase } from './types/group-dto';

const groupService = iocContainer.resolve(GroupService);

class GroupController implements IGroupController {
  @executionTimeTracker()
  async getAll(
    req: Request<any, Group[]>,
    res: Response<Group[]>,
    next: NextFunction
  ) {
    try {
      const groups = await groupService.getAll();

      res.send(groups);
    } catch (error) {
      controllerErrorLogger({
        controllerName: 'GroupController',
        methodName: 'getAll',
        args: req.query,
        error,
      });

      return next(error);
    }
  }

  @executionTimeTracker()
  async getOne(
    req: Request<GroupParams>,
    res: Response<Group>,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const currentGroup = await groupService.getOne(id);

      res.send(currentGroup);
    } catch (error) {
      controllerErrorLogger({
        controllerName: 'GroupController',
        methodName: 'getOne',
        args: req.params,
        error,
      });

      return next(error);
    }
  }

  @executionTimeTracker()
  async create(
    req: Request<any, Group, GroupBase>,
    res: Response<Group>,
    next: NextFunction
  ) {
    try {
      const group = await groupService.create(req.body);

      res.send(group);
    } catch (error) {
      controllerErrorLogger({
        controllerName: 'GroupController',
        methodName: 'create',
        args: req.body,
        error,
      });

      return next(error);
    }
  }

  @executionTimeTracker()
  async update(
    req: Request<GroupParams, Group, GroupBase>,
    res: Response<Group>,
    next: NextFunction
  ) {
    try {
      const {
        params: { id },
        body: groupData,
      } = req;
      const updatedGroup = await groupService.update(id, groupData);

      res.send(updatedGroup);
    } catch (error) {
      controllerErrorLogger({
        controllerName: 'GroupController',
        methodName: 'update',
        args: { params: req.params, body: req.body },
        error,
      });

      return next(error);
    }
  }

  @executionTimeTracker()
  async delete(
    req: Request<GroupParams>,
    res: Response<string>,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      await groupService.delete(id);

      res.send(`Group with id: ${id} successfully deleted`);
    } catch (error) {
      controllerErrorLogger({
        controllerName: 'GroupController',
        methodName: 'delete',
        args: req.params,
        error,
      });

      return next(error);
    }
  }

  @executionTimeTracker()
  async addUsersToGroup(
    req: Request<GroupParams, Group, AddUserToGroupRequestBody>,
    res: Response<Group>,
    next: NextFunction
  ) {
    try {
      const {
        params: { id },
        body: { usersIds },
      } = req;

      const updatedGroup = await groupService.addUsersToGroup(id, usersIds);

      res.send(updatedGroup);
    } catch (error) {
      controllerErrorLogger({
        controllerName: 'GroupController',
        methodName: 'addUsersToGroup',
        args: { params: req.params, body: req.body },
        error,
      });

      return next(error);
    }
  }
}

const groupController = new GroupController();

export { groupController };
