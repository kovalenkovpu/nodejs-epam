import { NextFunction, Request, Response } from 'express';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';
import last from 'lodash/last';

import dataBase from '../../../db/models';
import { uuidv4Schema } from '../../common/schemas';
import { IDataBase } from '../../common/types/db-types';
import { formatError } from '../../common/utils';
import { UserParams } from '../types/user-controller.types';
import { User, UserBase } from '../types/user-dto';

import { userLoginSchema, userSchema } from './user-schema';

// Dirty hack to make JS work with TS and preserve typings
const db = (dataBase as unknown) as IDataBase;

const validateUserId = async (
  req: Request<UserParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      params: { id },
    } = req;

    await uuidv4Schema().validateAsync(id, { abortEarly: false });

    return next();
  } catch (error) {
    res.status(400).json(formatError(error));
  }
};

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
    // TODO: think over how to make this external validation some other way
    const existingUsersInstances = await db.User.findAll();
    const existingUsers = existingUsersInstances.map((user) => user.get());

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
    // TODO: think over how to make this external validation some other way
    const existingUsersInstances = await db.User.findAll();
    let existingUsers = existingUsersInstances.map((user) => user.get());
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

const validateQueryParams = (
  req: Request<any, any, any, { loginSubstring: any; limit: any }>,
  res: Response,
  next: NextFunction
): void => {
  const {
    query: { loginSubstring = '', limit },
  } = req;
  const limitNumber = Number(limit);
  const limitSafe =
    !isEmpty(limit) && isNumber(limitNumber) && !isNaN(limitNumber)
      ? limitNumber
      : undefined;

  req.query = { loginSubstring, limit: limitSafe };

  return next();
};

export {
  validateUserId,
  validateUser,
  validateUserUniqueCreate,
  validateUserUniqueUpdate,
  validateQueryParams,
};
