import Joi from 'joi';

import { LoginData } from '../types/login-data';

const loginSchema = Joi.object<LoginData>({
  login: Joi.string().required(),
  password: Joi.string().required(),
});

export { loginSchema };
