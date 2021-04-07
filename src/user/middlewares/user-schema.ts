import Joi from 'joi';
import isUUID from 'validator/lib/isUUID';

import { UserBase } from '../types/user-dto';

const UUID_VERSION = 4;

const userIdSchema = Joi.string()
  .custom((id: string) => {
    if (!isUUID(id, UUID_VERSION)) {
      throw new Error();
    }

    return id;
  })
  .message('"id" is not a valid UUIDv4 string');

const userSchema = Joi.object<UserBase>({
  login: Joi.string().trim().required(),
  password: Joi.string()
    .alphanum()
    .trim()
    // "abc", "111" - not allowed
    // "1a", "a1", "11a", "aa1" etc. - allowed
    .pattern(new RegExp('([a-zA-Z])+'))
    .pattern(new RegExp('([0-9])+'))
    .required()
    .messages({
      'string.pattern.base': 'Password must contain letters and numbers',
    }),
  age: Joi.number().integer().strict().min(4).max(130).required(),
});

const userLoginSchema = Joi.array()
  .unique('login', { ignoreUndefined: true })
  .messages({
    'array.unique': '"login" is not unique',
  });

export { userIdSchema, userSchema, userLoginSchema };
