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
  private generateNotFoundMessage = (id: string) =>
    `User with id: ${id} not found`;

  getAll = (
    req: Request<any, User[] | UserDTO[], any, GetAllUsersQueryParams>,
    res: Response<User[] | UserDTO[]>
  ) => {
    try {
      const { withCompleteData } = req.query;

      if (withCompleteData === WITH_COMPLETE_DATA) {
        res.send(userService.userDTOsWithDeleted);
      }

      res.send(userService.getAll());
    } catch (error) {
      res.status(500).json(error);
    }
  };

  getAutoSuggestUsers = (
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

      const autosuggestedUsers = userService.getAutoSuggestUsers(
        loginSubstring,
        limit
      );

      res.send(autosuggestedUsers);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  getOne = (req: Request<UserParams>, res: Response<User | string>) => {
    try {
      const { id } = req.params;
      const currentUser = userService.getOne(id);

      if (!currentUser) {
        const errorMessage = this.generateNotFoundMessage(id);

        return res.status(404).json(errorMessage);
      }

      res.send(currentUser);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  create = (req: Request<any, User, UserBase>, res: Response<User>) => {
    try {
      const user = userService.create(req.body);

      res.send(user);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  update = (
    req: Request<UserParams, User, UserBase>,
    res: Response<User | string>
  ) => {
    try {
      const {
        params: { id },
        body: userData,
      } = req;

      const updatedUser = userService.update(id, userData);

      if (!updatedUser) {
        const errorMessage = this.generateNotFoundMessage(id);

        return res.status(404).json(errorMessage);
      }

      res.send(updatedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  delete = (req: Request<UserParams>, res: Response<User | string>) => {
    try {
      const { id } = req.params;
      const deletedUser = userService.delete(id);

      if (!deletedUser) {
        const errorMessage = this.generateNotFoundMessage(id);

        return res.status(404).json(errorMessage);
      }

      res.send(`User with id: ${id} successfully deleted`);
    } catch (error) {
      res.status(500).json(error);
    }
  };
}

const userController = new UserController();

export { userController };
