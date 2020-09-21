import express from 'express';
import { Container } from 'typedi';
import { postSchema } from './schemas/usergroup/request';
import { ValidatedRequest, createValidator } from 'express-joi-validation';
import { AddUserGroupSchema } from './schemas/usergroup/validated';
import UserGroupService from '../services/usergroup.service';

const router = express.Router();
const validator = createValidator();

router.post('/:groupId', validator.body(postSchema), async (req: ValidatedRequest<AddUserGroupSchema>, res) => {
    try {
        await Container.get(UserGroupService).addUsersToGroup(+req.params.groupId, req.body.users);
        res.status(204).send();
    }
    catch (e) {
        res.status(500).json({ error: "Error adding users to group." });
    }
});

export default router;