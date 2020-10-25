import express, { Response } from 'express';
import { Container } from 'typedi';
import { postSchema } from './schemas/usergroup/request';
import { ValidatedRequest, createValidator } from 'express-joi-validation';
import { AddUserGroupSchema } from './schemas/usergroup/validated';
import UserGroupService from '../services/usergroup.service';
import handleError from './handlers/error';

const router = express.Router();
const validator = createValidator();

router.post('/:groupId', validator.body(postSchema), handleError(async (req: ValidatedRequest<AddUserGroupSchema>, res: Response) => {
    await Container.get(UserGroupService).addUsersToGroup(+req.params.groupId, req.body.users);
    res.status(204).send();

}));

export default router;