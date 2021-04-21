import { Request, Response } from 'express';

import { IGroupController, GroupParams } from './types/group-controller.types';
import { Group, GroupBase } from './types/group-dto';
import { groupService } from './group-service';

class GroupController implements IGroupController {
  private generateNotFoundMessage = (id: string) =>
    `Group with id: ${id} not found`;

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

      if (!currentGroup) {
        const errorMessage = this.generateNotFoundMessage(id);

        return res.status(404).json(errorMessage);
      }

      res.send(currentGroup);
    } catch (error) {
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

      if (!updatedGroup) {
        const errorMessage = this.generateNotFoundMessage(id);

        return res.status(404).json(errorMessage);
      }

      res.send(updatedGroup);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  delete = async (req: Request<GroupParams>, res: Response<Group | string>) => {
    try {
      const { id } = req.params;
      const deletedGroup = await groupService.delete(id);

      if (!deletedGroup) {
        const errorMessage = this.generateNotFoundMessage(id);

        return res.status(404).json(errorMessage);
      }

      res.send(`Group with id: ${id} successfully deleted`);
    } catch (error) {
      res.status(500).json(error);
    }
  };
}

const groupController = new GroupController();

export { groupController };
