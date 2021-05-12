import express from 'express';

import { groupController } from './group-controller';
import * as groupValidationMiddleware from './middlewares/group-validator';

const groupRouter = express.Router();

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
