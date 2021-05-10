import { NextFunction, Request, Response } from 'express';

import {
  IGroupController,
  GroupParams,
  AddUserToGroupRequestBody,
} from './types/group-controller.types';
import { Group, GroupBase } from './types/group-dto';
import { groupService } from './group-service';

class GroupController implements IGroupController {
  getAll = async (
    req: Request<any, Group[]>,
    res: Response<Group[]>,
    next: NextFunction
  ) => {
    try {
      const groups = await groupService.getAll();

      res.send(groups);
    } catch (error) {
      return next(error);
    }
  };

  getOne = async (
    req: Request<GroupParams>,
    res: Response<Group>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const currentGroup = await groupService.getOne(id);

      res.send(currentGroup);
    } catch (error) {
      return next(error);
    }
  };

  create = async (
    req: Request<any, Group, GroupBase>,
    res: Response<Group>,
    next: NextFunction
  ) => {
    try {
      const group = await groupService.create(req.body);

      res.send(group);
    } catch (error) {
      return next(error);
    }
  };

  update = async (
    req: Request<GroupParams, Group, GroupBase>,
    res: Response<Group>,
    next: NextFunction
  ) => {
    try {
      const {
        params: { id },
        body: groupData,
      } = req;
      const updatedGroup = await groupService.update(id, groupData);

      res.send(updatedGroup);
    } catch (error) {
      return next(error);
    }
  };

  delete = async (
    req: Request<GroupParams>,
    res: Response<string>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;

      await groupService.delete(id);

      res.send(`Group with id: ${id} successfully deleted`);
    } catch (error) {
      return next(error);
    }
  };

  addUsersToGroup = async (
    req: Request<GroupParams, Group, AddUserToGroupRequestBody>,
    res: Response<Group>,
    next: NextFunction
  ) => {
    try {
      const {
        params: { id },
        body: { usersIds },
      } = req;

      const updatedGroup = await groupService.addUsersToGroup(id, usersIds);

      res.send(updatedGroup);
    } catch (error) {
      return next(error);
    }
  };
}

const groupController = new GroupController();

export { groupController };
