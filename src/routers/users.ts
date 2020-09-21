import express from 'express';
import UsersService from '../services/users.service';
import { Container } from 'typedi';
import { postSchema, putSchema, limitSchema } from './schemas/users/request';
import { ValidatedRequest, createValidator } from 'express-joi-validation';
import { AddUserSchema, PutUserSchema, LimitUsersSchema } from './schemas/users/validated';

const router = express.Router();
const validator = createValidator();

router.get('/:id', async (req, res) => {
    try {
        const user = await Container.get(UsersService).getById(+req.params.id);
        if (user) {
            res.json(user);
        }
        else {
            res.status(400).json({ error: "A user with that id does not exist." });
        }
    }
    catch (e) {
        res.status(500).json({ error: "Error retrieving user." });
    }
});

router.get('/autoSuggest/:login', validator.query(limitSchema), async (req: ValidatedRequest<LimitUsersSchema>, res) => {
    try {
        const { login } = req.params;
        const { limit } = req.query;
        const users = await Container.get(UsersService).autoSuggest(login, limit ? +limit : undefined);
        res.json(users);
    }
    catch (e) {
        res.status(500).json({ error: "Error retrieving users." });
    }
});

router.post('/', validator.body(postSchema), async (req: ValidatedRequest<AddUserSchema>, res, next) => {
    try {
        const usersService = Container.get(UsersService);
        if (await usersService.getByLogin(req.body.login)) {
            res.status(400).json({ error: "A user with the same login already exists." });
        }
        else {
            await usersService.create(req.body);
            res.status(204).send();
        }
    }
    catch (e) {
        res.status(500).json({ error: "Error creating user." });
    }
});

router.put('/:id', validator.body(putSchema), async (req: ValidatedRequest<PutUserSchema>, res) => {
    try {
        const usersService = Container.get(UsersService);
        const userId = +req.params.id;

        if (!await usersService.getById(userId)) {
            res.status(400).json({ error: "A user with that id does not exist." });
        }
        else {
            const user = await usersService.getByLogin(req.body.login);
            if (!user || user.id === userId) {
                await usersService.update(userId, req.body);
                res.status(204).send();
            }
            else {
                res.status(400).json({ error: "A user with the same login already exists." });
            }
        }
    }
    catch (e) {
        res.status(500).json({ error: "Error updating user." });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const userId = +req.params.id;
        const usersService = Container.get(UsersService);

        if (await usersService.getById(userId)) {
            await usersService.delete(userId);
            res.status(204).send();
        }
        else {
            res.status(400).json({ error: "A user with that id does not exist." });
        }
    }
    catch (e) {
        res.status(500).json({ error: "Error deleting user." });
    }
});

export default router;