import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'joi';
import last from 'lodash/last';

import { FormatterValidationError } from './types/user-validator.types';
import { User, UserDTO } from '../types/user-dto';
import { userLoginSchema, userSchema } from '../user-schema';
import { userService } from '../user-service';
import { UserParams } from '../types/user-controller.types';

const formatError = ({ details }: ValidationError) =>
  details.map<FormatterValidationError>(({ message, path }) => ({
    message,
    path,
  }));

const validateUser = async (
  req: Request<any, UserDTO, User>,
  // TODO: find out the way to type it properly
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body: newUser } = req;

    const validatedUser: User = await userSchema.validateAsync(newUser, {
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

const validateUserUnique = async (
  req: Request<UserParams, UserDTO, User>,
  // TODO: find out the way to type it properly
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body: newUser } = req;
    const existingUsers = userService.usersWithoutDeleted;

    const validatedUser: User[] = await userLoginSchema.validateAsync(
      [...existingUsers, newUser],
      { abortEarly: false }
    );

    // If data is validated properly - we should proceed with that validated
    // data to make joi's "trim" work.
    // We're also sure there's always last element
    // in the validation result array
    req.body = last(validatedUser) as User;

    return next();
  } catch (error) {
    res.status(400).json(formatError(error));
  }
};

export { validateUser, validateUserUnique };
