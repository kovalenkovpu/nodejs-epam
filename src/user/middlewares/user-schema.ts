import Joi from 'joi';

import { UserBase } from '../types/user-dto';

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
      'string.pattern.base': '"password" must contain letters and numbers',
    }),
  age: Joi.number().integer().strict().min(4).max(130).required(),
});

const userLoginSchema = Joi.array()
  .unique('login', { ignoreUndefined: true })
  .message('"login" is not unique');

export { userSchema, userLoginSchema };
