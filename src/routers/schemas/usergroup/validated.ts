import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';

interface AddUserGroupSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: { users: number[] }
};

export { AddUserGroupSchema };