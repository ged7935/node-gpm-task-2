import Joi from '@hapi/joi';
import { User } from '../../models/user';

const putSchema = Joi.object<Omit<User, 'id' | 'isDeleted'>>({
    login: Joi.string().required(),
    password: Joi.string().regex(/[0-9]/).regex(/[A-Za-z]/).required(),
    age: Joi.number().min(4).max(130).required()
});

const postSchema = Joi.object<Omit<User, 'id' | 'isDeleted'>>({
    login: Joi.string().required(),
    password: Joi.string().regex(/[0-9]/).regex(/[A-Za-z]/).required(),
    age: Joi.number().min(4).max(130).required()
});

const limitSchema = Joi.object({
    limit: Joi.number()
});

export { putSchema, postSchema, limitSchema };