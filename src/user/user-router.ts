import express from 'express';

import * as userValidationMiddleware from './middlewares/user-validator';
import { userController } from './user-controller';

const userRouter = express.Router();

userRouter.get('/', userController.getAll);

userRouter.get('/search', userController.getAutoSuggestUsers);

userRouter.get('/:id', userController.getOne);

userRouter.post(
  '/',
  userValidationMiddleware.validateUser,
  userValidationMiddleware.validateUserUnique,
  userController.create
);

userRouter.put(
  '/:id',
  userValidationMiddleware.validateUser,
  userValidationMiddleware.validateUserUnique,
  userController.update
);

userRouter.delete('/:id', userController.delete);

export { userRouter };
