import { Request, Response } from 'express';

import { Group, GroupBase, GroupId } from './group-dto';

interface GroupParams {
  id: GroupId;
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
}

export type { IGroupController, GroupParams };
