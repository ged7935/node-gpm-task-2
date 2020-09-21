import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import { Group } from '../../../models/group';

interface AddGroupSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: Omit<Group, 'id'>
};

interface PutGroupSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: Omit<Group, 'id'>
};

export { AddGroupSchema, PutGroupSchema};