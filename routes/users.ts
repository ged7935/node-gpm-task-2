import express from 'express';
import { v4 as uuid } from 'uuid';
import { users } from '../data/users';
import { ValidatedRequest, createValidator } from 'express-joi-validation';
import { patchSchema, postSchema, querySchema } from './schemas/request';
import { AddUserSchema, LimitUsersSchema, PatchUserSchema } from './schemas/validated';

const validator = createValidator();
const router = express.Router();

router.get('/', validator.query(querySchema), (req: ValidatedRequest<LimitUsersSchema>, res) => {
    const { substring, limit } = req.query;

    let usersList = users;
    if (substring) {
        usersList = usersList.filter(u => u.login.includes(substring)).sort((u1, u2) => u1.login < u2.login ? -1 : 1);
    }

    res.json(limit ? usersList.splice(0, limit) : usersList);
});

router.get('/:id', (req, res, next) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
        res.status(400).json({ error: "User does not exist." });
    }
    else {
        res.json(user);
    }
});

router.post('/', validator.body(postSchema), (req: ValidatedRequest<AddUserSchema>, res) => {
    if (users.find(u => u.login === req.body.login)) {
        res.status(400).json({ error: "Login already exists." });
    }

    users.push({
        id: uuid(),
        ...req.body
    });
    res.status(204).send();
});

router.patch('/:id', validator.body(patchSchema), (req: ValidatedRequest<PatchUserSchema>, res) => {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) {
        res.status(400).json({ error: "User does not exist." });
    }
    else {
        users[userIndex] = { ...users[userIndex], ...req.body };
        res.status(204).send();
    }
});

router.delete('/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
        res.status(400).json({ error: "User does not exist." });
    }
    else {
        user.isDeleted = true;
        res.status(204).send();
    }
});

export { router as UserRouter };