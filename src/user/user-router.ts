import express from 'express';

import { iocContainer } from '../inversify.config';

import * as userValidationMiddleware from './middlewares/user-validator';
import { UserController } from './user-controller';

const userRouter = express.Router();
const userController = iocContainer.resolve(UserController);

userRouter.get('/', userController.getAll);

userRouter.get(
  '/search',
  userValidationMiddleware.validateQueryParams,
  userController.getAutoSuggestUsers
);

userRouter.get(
  '/:id',
  userValidationMiddleware.validateUserId,
  userController.getOne
);

userRouter.post(
  '/',
  userValidationMiddleware.validateUser,
  userValidationMiddleware.validateUserUniqueCreate,
  userController.create
);

userRouter.put(
  '/:id',
  userValidationMiddleware.validateUserId,
  userValidationMiddleware.validateUser,
  userValidationMiddleware.validateUserUniqueUpdate,
  userController.update
);

userRouter.delete(
  '/:id',
  userValidationMiddleware.validateUserId,
  userController.delete
);

export { userRouter };
