import express, { Request, Response } from 'express';
import UsersService from '../services/users.service';
import { Container } from 'typedi';
import { postSchema, putSchema, limitSchema } from './schemas/users/request';
import { ValidatedRequest, createValidator } from 'express-joi-validation';
import { AddUserSchema, PutUserSchema, LimitUsersSchema } from './schemas/users/validated';
import handleError from './handlers/error';

const router = express.Router();
const validator = createValidator();

router.get('/:id', handleError(async (req: Request, res: Response) => {
    const user = await Container.get(UsersService).getById(+req.params.id);
    if (user) {
        res.json(user);
    }
    else {
        res.status(400).json({ error: "A user with that id does not exist." });
    }
}));

router.get('/autoSuggest/:login', validator.query(limitSchema), handleError(async (req: ValidatedRequest<LimitUsersSchema>, res: Response) => {
    const { login } = req.params;
    const { limit } = req.query;
    const users = await Container.get(UsersService).autoSuggest(login, limit ? +limit : undefined);
    res.json(users);
}));

router.post('/', validator.body(postSchema), handleError(async (req: ValidatedRequest<AddUserSchema>, res: Response) => {
    const usersService = Container.get(UsersService);
    if (await usersService.getByLogin(req.body.login)) {
        res.status(400).json({ error: "A user with the same login already exists." });
    }
    else {
        await usersService.create(req.body);
        res.status(204).send();
    }
}));

router.put('/:id', validator.body(putSchema), handleError(async (req: ValidatedRequest<PutUserSchema>, res: Response) => {
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
}));

router.delete('/:id', handleError(async (req: Request, res: Response) => {
    const userId = +req.params.id;
    const usersService = Container.get(UsersService);

    if (await usersService.getById(userId)) {
        await usersService.delete(userId);
        res.status(204).send();
    }
    else {
        res.status(400).json({ error: "A user with that id does not exist." });
    }
}));

export default router;