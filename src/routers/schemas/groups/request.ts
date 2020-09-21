import Joi from '@hapi/joi';
import { Group } from '../../../models/group';

const putSchema = Joi.object<Omit<Group, 'id'>>({
    name: Joi.string().required(),
    permissions: Joi.array().items(Joi.string()).required()
});

const postSchema = Joi.object<Omit<Group, 'id'>>({
    name: Joi.string().required(),
    permissions: Joi.array().items(Joi.string()).required()
});

export { putSchema, postSchema };