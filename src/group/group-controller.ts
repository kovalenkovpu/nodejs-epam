import { Request, Response } from 'express';

import {
  IGroupController,
  GroupParams,
  AddUserToGroupRequestBody,
} from './types/group-controller.types';
import { Group, GroupBase } from './types/group-dto';
import { groupService } from './group-service';

class GroupController implements IGroupController {
  getAll = async (req: Request<any, Group[]>, res: Response<Group[]>) => {
    try {
      const groups = await groupService.getAll();

      res.send(groups);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  getOne = async (req: Request<GroupParams>, res: Response<Group | string>) => {
    try {
      const { id } = req.params;
      const currentGroup = await groupService.getOne(id);

      res.send(currentGroup);
    } catch (error) {
      if (error.isNotFound) {
        return res.status(404).json(error.message);
      }

      res.status(500).json(error);
    }
  };

  create = async (
    req: Request<any, Group, GroupBase>,
    res: Response<Group>
  ) => {
    try {
      const group = await groupService.create(req.body);

      res.send(group);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  update = async (
    req: Request<GroupParams, Group, GroupBase>,
    res: Response<Group | string>
  ) => {
    try {
      const {
        params: { id },
        body: groupData,
      } = req;
      const updatedGroup = await groupService.update(id, groupData);

      res.send(updatedGroup);
    } catch (error) {
      if (error.isNotFound) {
        return res.status(404).json(error.message);
      }

      res.status(500).json(error);
    }
  };

  delete = async (req: Request<GroupParams>, res: Response<Group | string>) => {
    try {
      const { id } = req.params;

      await groupService.delete(id);

      res.send(`Group with id: ${id} successfully deleted`);
    } catch (error) {
      if (error.isNotFound) {
        return res.status(404).json(error.message);
      }

      res.status(500).json(error);
    }
  };

  addUsersToGroup = async (
    req: Request<GroupParams, any, AddUserToGroupRequestBody>,
    res: Response<string>
  ) => {
    try {
      const {
        params: { id },
        body: { usersIds },
      } = req;

      await groupService.addUsersToGroup(id, usersIds);

      res.send(`Group with id: ${id} successfully updated`);
    } catch (error) {
      if (error.isNotFound) {
        return res.status(404).json(error.message);
      }

      res.status(500).json(error);
    }
  };
}

const groupController = new GroupController();

export { groupController };
