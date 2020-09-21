import Joi from '@hapi/joi';

const postSchema = Joi.object({
    users: Joi.array().items(Joi.number()).required()
});

export { postSchema };