import { NextFunction, Request, Response } from 'express';

import { UserId } from '../../user/types/user-dto';

import { Group, GroupBase, GroupId } from './group-dto';

interface GroupParams {
  id: GroupId;
}

interface AddUserToGroupRequestBody {
  usersIds: UserId[];
}

interface IGroupController {
  getAll: (
    req: Request<unknown, Group[]>,
    res: Response<Group[]>,
    next: NextFunction
  ) => Promise<void>;

  getOne: (
    req: Request<GroupParams>,
    res: Response<Group>,
    next: NextFunction
  ) => Promise<void>;

  create: (
    req: Request<unknown, Group, GroupBase>,
    res: Response<Group>,
    next: NextFunction
  ) => Promise<void>;

  update: (
    req: Request<GroupParams, Group, GroupBase>,
    res: Response<Group>,
    next: NextFunction
  ) => Promise<void>;

  delete: (
    req: Request<GroupParams>,
    res: Response<string>,
    next: NextFunction
  ) => Promise<void | Response<string>>;

  addUsersToGroup: (
    req: Request<GroupParams, Group, AddUserToGroupRequestBody>,
    res: Response<Group>,
    next: NextFunction
  ) => Promise<void>;
}

export type { IGroupController, GroupParams, AddUserToGroupRequestBody };
