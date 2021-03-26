import Joi from 'joi';

import { User } from './types/user-dto';

const userSchema = Joi.object<User>({
  login: Joi.string().trim().required(),
  password: Joi.string()
    .alphanum()
    .trim()
    // "abc", "111" - not allowed
    // "1a", "a1", "11a", "aa1" etc. - allowed
    .pattern(new RegExp('^([a-zA-Z]+[0-9]+)|([0-9]+[a-zA-Z]+)$'))
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

export { userSchema, userLoginSchema };
