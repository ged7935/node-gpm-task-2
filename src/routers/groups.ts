import express, { Request, Response } from 'express';
import { Container } from 'typedi';
import { putSchema, postSchema } from './schemas/groups/request';
import { PutGroupSchema, AddGroupSchema } from './schemas/groups/validated';
import { createValidator, ValidatedRequest } from 'express-joi-validation';
import GroupsService from '../services/groups.service';
import handleError from './handlers/error';

const router = express.Router();
const validator = createValidator();

router.get('/', handleError(async (req: Request, res: Response) => {
    const groups = await Container.get(GroupsService).getAll();
    res.json(groups);
}));

router.get('/:id', handleError(async (req: Request, res: Response) => {
    const group = await Container.get(GroupsService).getById(+req.params.id);
    res.json(group);
}));

router.post('/', validator.body(postSchema), handleError(async (req: ValidatedRequest<AddGroupSchema>, res: Response) => {
    await Container.get(GroupsService).create(req.body);
    res.status(204).send();
}));

router.put('/:id', validator.body(putSchema), handleError(async (req: ValidatedRequest<PutGroupSchema>, res: Response) => {
    await Container.get(GroupsService).update(+req.params.id, req.body);
    res.status(204).send();
}));

router.delete('/:id', handleError(async (req: Request, res: Response) => {
    await Container.get(GroupsService).delete(+req.params.id);
    res.status(204).send();
}));

export default router;