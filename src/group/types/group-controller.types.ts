import { Request, Response } from 'express';

import { UserId } from '../../user/types/user-dto';

import { Group, GroupBase, GroupId } from './group-dto';

interface GroupParams {
  id: GroupId;
}

interface AddUserToGroupRequestBody {
  usersIds: UserId[];
}

interface IGroupController {
  getAll: (req: Request<any, Group[]>, res: Response<Group[]>) => Promise<void>;

  getOne: (
    req: Request<GroupParams>,
    res: Response<Group | string>
  ) => Promise<void | Response<string>>;

  create: (
    req: Request<any, Group, GroupBase>,
    res: Response<Group>
  ) => Promise<void>;

  update: (
    req: Request<GroupParams, Group, GroupBase>,
    res: Response<Group | string>
  ) => Promise<void | Response<string>>;

  delete: (
    req: Request<GroupParams>,
    res: Response<Group | string>
  ) => Promise<void | Response<string>>;

  addUsersToGroup: (
    req: Request<GroupParams, any, AddUserToGroupRequestBody>,
    res: Response<Group | string>
  ) => Promise<void | Response<string>>;
}

export type { IGroupController, GroupParams, AddUserToGroupRequestBody };
