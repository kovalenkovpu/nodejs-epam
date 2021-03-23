import Joi from 'joi';

import { User } from './user-dto';

const userSchema = Joi.object<User>({
	login: Joi.string().trim().required(),
	password: Joi.string()
		.alphanum()
		.pattern(new RegExp('^([a-zA-Z]+[0-9]+)|([0-9]+[a-zA-Z]+)$'))
		.required()
		.messages({
			'string.pattern.base': `Password must contain letters and numbers`,
		}),
	age: Joi.number().min(4).max(130).required(),
});

const userLoginSchema = Joi.array()
	.unique('login', { ignoreUndefined: true })
	.messages({
		'array.unique': 'Login is not unique',
	});

export { userSchema, userLoginSchema };
