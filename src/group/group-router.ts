import express from 'express';

import { iocContainer } from '../inversify.config';
import { TYPES } from '../inversify.types';

import * as groupValidationMiddleware from './middlewares/group-validator';
import { IGroupController } from './types/group-controller.types';

const groupRouter = express.Router();
const groupController = iocContainer.get<IGroupController>(
  TYPES.GroupController
);

groupRouter.get('/', groupController.getAll);

groupRouter.get(
  '/:id',
  groupValidationMiddleware.validateGroupId,
  groupController.getOne
);

groupRouter.post(
  '/',
  groupValidationMiddleware.validateGroup,
  groupValidationMiddleware.validateGroupUniqueCreate,
  groupController.create
);

groupRouter.put(
  '/:id',
  groupValidationMiddleware.validateGroupId,
  groupValidationMiddleware.validateGroup,
  groupValidationMiddleware.validateGroupUniqueUpdate,
  groupController.update
);

groupRouter.delete(
  '/:id',
  groupValidationMiddleware.validateGroupId,
  groupController.delete
);

groupRouter.post(
  '/:id/users',
  groupValidationMiddleware.validateGroupId,
  groupValidationMiddleware.validateGroupUsersIds,
  groupController.addUsersToGroup
);

export { groupRouter };
