import express from 'express';

import { userController } from './user-controller';

const userRouter = express.Router();

userRouter.get('/all', userController.getAll);

userRouter.get('/:id', userController.getOne);

userRouter.post('/', userController.create);

userRouter.put('/:id', userController.update);

userRouter.delete('/:id', userController.delete);

export { userRouter };
