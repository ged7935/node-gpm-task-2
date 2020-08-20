import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import User from '../../models/User';

interface AddUserSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: Omit<User, 'id'>
};

interface LimitUsersSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: {
        substring: string | undefined
        limit: number | undefined
    }
};

interface PatchUserSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: Partial<Omit<User, 'id'>>
};

export { AddUserSchema, LimitUsersSchema, PatchUserSchema};