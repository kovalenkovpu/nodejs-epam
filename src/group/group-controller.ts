import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { controllerErrorLogger, executionTimeTracker } from '../common/utils';
import { TYPES } from '../types';

import { GroupService } from './group-service';
import {
  IGroupController,
  GroupParams,
  AddUserToGroupRequestBody,
} from './types/group-controller.types';
import { Group, GroupBase } from './types/group-dto';

@injectable()
class GroupController implements IGroupController {
  private groupService: GroupService;

  constructor(@inject(TYPES.GroupService) groupService: GroupService) {
    this.groupService = groupService;

    this.getAll = this.getAll.bind(this);
    this.getOne = this.getOne.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.addUsersToGroup = this.addUsersToGroup.bind(this);
  }

  @executionTimeTracker()
  async getAll(
    req: Request<any, Group[]>,
    res: Response<Group[]>,
    next: NextFunction
  ): Promise<void> {
    try {
      const groups = await this.groupService.getAll();

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
  ): Promise<void> {
    try {
      const { id } = req.params;
      const currentGroup = await this.groupService.getOne(id);

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
  ): Promise<void> {
    try {
      const group = await this.groupService.create(req.body);

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
  ): Promise<void> {
    try {
      const {
        params: { id },
        body: groupData,
      } = req;
      const updatedGroup = await this.groupService.update(id, groupData);

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
  ): Promise<void> {
    try {
      const { id } = req.params;

      await this.groupService.delete(id);

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
  ): Promise<void> {
    try {
      const {
        params: { id },
        body: { usersIds },
      } = req;

      const updatedGroup = await this.groupService.addUsersToGroup(
        id,
        usersIds
      );

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

export { GroupController };
