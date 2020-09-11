import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import { User } from '../../models/user';

interface AddUserSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: Omit<User, 'id' | 'isDeleted'>
};

interface LimitUsersSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: {
        limit: number | undefined
    }
};

interface PutUserSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: Omit<User, 'id | isDeleted'>
};

export { AddUserSchema, LimitUsersSchema, PutUserSchema};