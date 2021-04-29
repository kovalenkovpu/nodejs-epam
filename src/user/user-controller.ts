import { Request, Response } from 'express';

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
    res: Response<User[] | UserDTO[]>
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
      res.status(500).json(error);
    }
  };

  getAutoSuggestUsers = async (
    req: Request<
      any,
      AutosuggestUsersResponse,
      undefined,
      AutosuggestUsersQueryParams
    >,
    res: Response<AutosuggestUsersResponse>
  ) => {
    try {
      const { loginSubstring, limit } = req.query;
      const autosuggestedUsers = await userService.getAutoSuggestUsers(
        loginSubstring,
        limit
      );

      res.send(autosuggestedUsers);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  getOne = async (req: Request<UserParams>, res: Response<User | string>) => {
    try {
      const { id } = req.params;
      const currentUser = await userService.getOne(id);

      res.send(currentUser);
    } catch (error) {
      if (error.isNotFound) {
        res.status(404).json(error.message);
      }

      res.status(500).json(error);
    }
  };

  create = async (req: Request<any, User, UserBase>, res: Response<User>) => {
    try {
      const user = await userService.create(req.body);

      res.send(user);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  update = async (
    req: Request<UserParams, User, UserBase>,
    res: Response<User | string>
  ) => {
    try {
      const {
        params: { id },
        body: userData,
      } = req;
      const updatedUser = await userService.update(id, userData);

      res.send(updatedUser);
    } catch (error) {
      if (error.isNotFound) {
        res.status(404).json(error.message);
      }

      res.status(500).json(error);
    }
  };

  delete = async (req: Request<UserParams>, res: Response<User | string>) => {
    try {
      const { id } = req.params;

      await userService.delete(id);

      res.send(`User with id: ${id} successfully deleted`);
    } catch (error) {
      if (error.isNotFound) {
        res.status(404).json(error.message);
      }

      res.status(500).json(error);
    }
  };
}

const userController = new UserController();

export { userController };
