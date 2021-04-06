import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'joi';
import last from 'lodash/last';
import find from 'lodash/find';

import { FormatterValidationError } from './types/user-validator.types';
import { User, UserBase } from '../types/user-dto';
import { userLoginSchema, userSchema } from './user-schema';
import { userService } from '../user-service';
import { UserParams } from '../types/user-controller.types';

const formatError = ({ details }: ValidationError) =>
  details.map<FormatterValidationError>(({ message, path }) => ({
    message,
    path,
  }));

const validateUser = async (
  req: Request<any, UserBase, UserBase>,
  // TODO: find out the way to type it properly
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body: newUser } = req;

    const validatedUser: UserBase = await userSchema.validateAsync(newUser, {
      abortEarly: false,
    });

    // If data is validated properly - we should proceed with that validated
    // data to make joi's "trim" work
    req.body = validatedUser;

    return next();
  } catch (error) {
    res.status(400).json(formatError(error));
  }
};

const validateUserUniqueCreate = async (
  req: Request<any, UserBase, UserBase>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body: newUser } = req;
    const existingUsers = await userService.getAll();

    const validatedUsers = await userLoginSchema.validateAsync(
      [...existingUsers, newUser],
      { abortEarly: false }
    );

    // If data is validated properly - we should proceed with that validated
    // data to make joi's "trim" work.
    // We're also sure there's always last element
    // in the validation result array
    req.body = last(validatedUsers) as UserBase;

    return next();
  } catch (error) {
    res.status(400).json(formatError(error));
  }
};

const validateUserUniqueUpdate = async (
  req: Request<UserParams, User, UserBase>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      body: newUser,
      params: { id },
    } = req;
    let existingUsers = await userService.getAll();
    const existingUser = find(existingUsers, { id });

    if (!existingUser) {
      return next();
    }

    const userToUpdate: User = {
      ...existingUser,
      ...newUser,
    };

    existingUsers = existingUsers.filter((user) => user.id !== id);

    const validatedUsers = await userLoginSchema.validateAsync(
      [...existingUsers, userToUpdate],
      { abortEarly: false }
    );

    req.body = last(validatedUsers) as User;

    return next();
  } catch (error) {
    res.status(400).json(formatError(error));
  }
};

export { validateUser, validateUserUniqueCreate, validateUserUniqueUpdate };
