import Joi, { ValidationError } from '@hapi/joi';
import User from '../../models/User';

const patchSchema = Joi.object<Omit<User, 'id'>>({
    login: Joi.string(),
    password: Joi.string().regex(/[0-9]/).regex(/[A-Za-z]/),
    age: Joi.number().min(4).max(130),
    isDeleted: Joi.boolean()
}).min(1);

const postSchema = Joi.object<Omit<User, 'id'>>({
    login: Joi.string().required(),
    password: Joi.string().regex(/[0-9]/).regex(/[A-Za-z]/).required(),
    age: Joi.number().min(4).max(130).required(),
    isDeleted: Joi.boolean().required()
});

const querySchema = Joi.object({
    substring: Joi.string(),
    limit: Joi.number()
});

export { patchSchema, postSchema, querySchema };