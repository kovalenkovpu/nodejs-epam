import { NextFunction, Request, Response } from 'express';
import last from 'lodash/last';

import { formatError } from '../../common/utils/error-handling';
import { GroupParams } from '../types/group-controller.types';
import { Group, GroupBase } from '../types/group-dto';
import { groupModel } from '../group-model';
import { groupIdSchema, groupNameSchema, groupSchema } from './group-schema';
import find from 'lodash/find';

const validateGroupId = async (
  req: Request<GroupParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      params: { id },
    } = req;

    await groupIdSchema.validateAsync(id, { abortEarly: false });

    return next();
  } catch (error) {
    res.status(400).json(formatError(error));
  }
};

const validateGroup = async (
  req: Request<any, GroupBase, GroupBase>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body: newGroup } = req;

    const validatedGroup: GroupBase = await groupSchema.validateAsync(
      newGroup,
      {
        abortEarly: false,
      }
    );

    // If data is validated properly - we should proceed with that validated
    // data to make joi's "trim" work
    req.body = validatedGroup;

    return next();
  } catch (error) {
    res.status(400).json(formatError(error));
  }
};

const validateGroupUniqueCreate = async (
  req: Request<any, GroupBase, GroupBase>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body: newGroup } = req;
    const existingGroup = await groupModel.getAll();

    const validatedGroups = await groupNameSchema.validateAsync(
      [...existingGroup, newGroup],
      { abortEarly: false }
    );

    // If data is validated properly - we should proceed with that validated
    // data to make joi's "trim" work.
    // We're also sure there's always last element
    // in the validation result array
    req.body = last(validatedGroups) as GroupBase;

    return next();
  } catch (error) {
    res.status(400).json(formatError(error));
  }
};

const validateGroupUniqueUpdate = async (
  req: Request<GroupParams, Group, GroupBase>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      body: newGroup,
      params: { id },
    } = req;
    let existingGroups = await groupModel.getAll();
    const existingGroup = find(existingGroups, { id });

    if (!existingGroup) {
      return next();
    }

    const groupToUpdate: Group = {
      ...existingGroup,
      ...newGroup,
    };

    existingGroups = existingGroups.filter((group) => group.id !== id);

    const validatedGroups = await groupNameSchema.validateAsync(
      [...existingGroups, groupToUpdate],
      { abortEarly: false }
    );

    req.body = last(validatedGroups) as Group;

    return next();
  } catch (error) {
    res.status(400).json(formatError(error));
  }
};

export {
  validateGroupId,
  validateGroup,
  validateGroupUniqueCreate,
  validateGroupUniqueUpdate,
};
