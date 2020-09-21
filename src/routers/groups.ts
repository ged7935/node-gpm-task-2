import express from 'express';
import { Container } from 'typedi';
import { putSchema, postSchema } from './schemas/groups/request';
import { PutGroupSchema, AddGroupSchema } from './schemas/groups/validated';
import { createValidator, ValidatedRequest } from 'express-joi-validation';
import GroupsService from '../services/groups.service';

const router = express.Router();
const validator = createValidator();

router.get('/', async (req, res) => {
    try {
        const groups = await Container.get(GroupsService).getAll();
        res.json(groups);
    }
    catch (e) {
        res.status(500).json({ error: "Error retrieving groups." });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const group = await Container.get(GroupsService).getById(+req.params.id);
        res.json(group);
    }
    catch (e) {
        res.status(500).json({ error: "Error retrieving group." });
    }
});

router.post('/', validator.body(postSchema), async (req: ValidatedRequest<AddGroupSchema>, res, next) => {
    try {
        await Container.get(GroupsService).create(req.body);
        res.status(204).send();
    }
    catch (e) {
        res.status(500).json({ error: "Error creating group." });
    }
});

router.put('/:id', validator.body(putSchema), async (req: ValidatedRequest<PutGroupSchema>, res) => {
    try {
        await Container.get(GroupsService).update(+req.params.id, req.body);
        res.status(204).send();
    }
    catch (e) {
        res.status(500).json({ error: "Error updating group." });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Container.get(GroupsService).delete(+req.params.id);
        res.status(204).send();
    }
    catch (e) {
        res.status(500).json({ error: "Error deleting group." });
    }
});

export default router;