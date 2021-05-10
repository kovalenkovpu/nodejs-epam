import { NextFunction, Request, Response } from 'express';

import {
  AutosuggestUsersQueryParams,
  AutosuggestUsersResponse,
  GetAllUsersQueryParams,
  IUserController,
  UserParams,
  WITH_COMPLETE_DATA,
} from './types/user-controller.types';
import { UserBase, User, UserDTO } from './types/user-dto';
import { userService } from './user-service';

class UserController implements IUserController {
  getAll = async (
    req: Request<any, User[] | UserDTO[], any, GetAllUsersQueryParams>,
    res: Response<User[] | UserDTO[]>,
    next: NextFunction
  ) => {
    try {
      let users: User[];
      const { withCompleteData } = req.query;

      if (withCompleteData === WITH_COMPLETE_DATA) {
        users = await userService.getAllWithCompleteData();
      } else {
        users = await userService.getAll();
      }

      res.send(users);
    } catch (error) {
      return next(error);
    }
  };

  getAutoSuggestUsers = async (
    req: Request<
      any,
      AutosuggestUsersResponse,
      undefined,
      AutosuggestUsersQueryParams
    >,
    res: Response<AutosuggestUsersResponse>,
    next: NextFunction
  ) => {
    try {
      const { loginSubstring, limit } = req.query;
      const autosuggestedUsers = await userService.getAutoSuggestUsers(
        loginSubstring,
        limit
      );

      res.send(autosuggestedUsers);
    } catch (error) {
      return next(error);
    }
  };

  getOne = async (
    req: Request<UserParams>,
    res: Response<User>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const currentUser = await userService.getOne(id);

      res.send(currentUser);
    } catch (error) {
      return next(error);
    }
  };

  create = async (
    req: Request<any, User, UserBase>,
    res: Response<User>,
    next: NextFunction
  ) => {
    try {
      const user = await userService.create(req.body);

      res.send(user);
    } catch (error) {
      return next(error);
    }
  };

  update = async (
    req: Request<UserParams, User, UserBase>,
    res: Response<User>,
    next: NextFunction
  ) => {
    try {
      const {
        params: { id },
        body: userData,
      } = req;
      const updatedUser = await userService.update(id, userData);

      res.send(updatedUser);
    } catch (error) {
      return next(error);
    }
  };

  delete = async (
    req: Request<UserParams>,
    res: Response<string>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;

      await userService.delete(id);

      res.send(`User with id: ${id} successfully deleted`);
    } catch (error) {
      return next(error);
    }
  };
}

const userController = new UserController();

export { userController };
