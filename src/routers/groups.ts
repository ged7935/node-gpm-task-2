import express, { Request, Response } from 'express';
import { Container } from 'typedi';
import { putSchema, postSchema } from './schemas/groups/request';
import { createValidator } from 'express-joi-validation';
import GroupsService from '../services/groups.service';
import handleError from './handlers/error';
import { create, getAll, remove, update } from './handlers/groups';

const router = express.Router();
const validator = createValidator();

router.get('/', handleError(getAll));

router.get('/:id', handleError(async (req: Request, res: Response) => {
    const group = await Container.get(GroupsService).getById(+req.params.id);
    res.json(group);
}));

router.post('/', validator.body(postSchema), handleError(create));

router.put('/:id', validator.body(putSchema), handleError(update));

router.delete('/:id', handleError(remove));

export default router;