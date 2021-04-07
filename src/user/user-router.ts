import express from 'express';

import * as userValidationMiddleware from './middlewares/user-validator';
import { userController } from './user-controller';

const userRouter = express.Router();

userRouter.get('/', userController.getAll);

userRouter.get('/search', userController.getAutoSuggestUsers);

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
