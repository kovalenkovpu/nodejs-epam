import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { controllerErrorLogger, executionTimeTracker } from '../common/utils';
import { TYPES } from '../inversify.types';

import {
  AutosuggestUsersQueryParams,
  AutosuggestUsersResponse,
  GetAllUsersQueryParams,
  IUserController,
  UserParams,
  WITH_COMPLETE_DATA,
} from './types/user-controller.types';
import { User, UserBase, UserDTO } from './types/user-dto';
import { UserService } from './user-service';

@injectable()
class UserController implements IUserController {
  private userService: UserService;

  constructor(@inject(TYPES.UserService) userService: UserService) {
    this.userService = userService;

    this.getAll = this.getAll.bind(this);
    this.getAutoSuggestUsers = this.getAutoSuggestUsers.bind(this);
    this.getOne = this.getOne.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  @executionTimeTracker()
  async getAll(
    req: Request<unknown, User[] | UserDTO[], any, GetAllUsersQueryParams>,
    res: Response<User[] | UserDTO[]>,
    next: NextFunction
  ): Promise<void> {
    try {
      let users: User[];
      const { withCompleteData } = req.query;

      if (withCompleteData === WITH_COMPLETE_DATA) {
        users = await this.userService.getAllWithCompleteData();
      } else {
        users = await this.userService.getAll();
      }

      res.send(users);
    } catch (error) {
      controllerErrorLogger({
        controllerName: 'UserController',
        methodName: 'getAll',
        args: req.query,
        error,
      });

      return next(error);
    }
  }

  @executionTimeTracker()
  async getAutoSuggestUsers(
    req: Request<
      unknown,
      AutosuggestUsersResponse,
      undefined,
      AutosuggestUsersQueryParams
    >,
    res: Response<AutosuggestUsersResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { loginSubstring, limit } = req.query;
      const autosuggestedUsers = await this.userService.getAutoSuggestUsers(
        loginSubstring,
        limit
      );

      res.send(autosuggestedUsers);
    } catch (error) {
      controllerErrorLogger({
        controllerName: 'UserController',
        methodName: 'getAutoSuggestUsers',
        args: req.query,
        error,
      });

      return next(error);
    }
  }

  @executionTimeTracker()
  async getOne(
    req: Request<UserParams>,
    res: Response<User>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const currentUser = await this.userService.getOne(id);

      res.send(currentUser);
    } catch (error) {
      controllerErrorLogger({
        controllerName: 'UserController',
        methodName: 'getOne',
        args: req.params,
        error,
      });

      return next(error);
    }
  }

  @executionTimeTracker()
  async create(
    req: Request<unknown, User, UserBase>,
    res: Response<User>,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await this.userService.create(req.body);

      res.send(user);
    } catch (error) {
      controllerErrorLogger({
        controllerName: 'UserController',
        methodName: 'create',
        args: req.body,
        error,
      });

      return next(error);
    }
  }

  @executionTimeTracker()
  async update(
    req: Request<UserParams, User, UserBase>,
    res: Response<User>,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        params: { id },
        body: userData,
      } = req;
      const updatedUser = await this.userService.update(id, userData);

      res.send(updatedUser);
    } catch (error) {
      controllerErrorLogger({
        controllerName: 'UserController',
        methodName: 'update',
        args: { params: req.params, body: req.body },
        error,
      });

      return next(error);
    }
  }

  @executionTimeTracker()
  async delete(
    req: Request<UserParams>,
    res: Response<string>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      await this.userService.delete(id);

      res.send(`User with id: ${id} successfully deleted`);
    } catch (error) {
      controllerErrorLogger({
        controllerName: 'UserController',
        methodName: 'delete',
        args: req.params,
        error,
      });

      return next(error);
    }
  }
}

export { UserController };
