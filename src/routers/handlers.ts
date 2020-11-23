import { Request, response, Response } from "express";
import { ValidatedRequest } from "express-joi-validation";
import Container from "typedi";
import UsersService from "../services/users.service";
import { AddUserSchema, LimitUsersSchema, PutUserSchema } from "./schemas/users/validated";

const getById = async (req: Request, res: Response) => {
    const user = await Container.get(UsersService).getById(+req.params.id);
    if (user) {
        res.json(user);
    }
    else {
        res.status(400).json({ error: "A user with that id does not exist." });
    }
}

const create = async (req: ValidatedRequest<AddUserSchema>, res: Response) => {
    const usersService = Container.get(UsersService);
    if (await usersService.getByLogin(req.body.login)) {
        res.status(400).json({ error: "A user with the same login already exists." });
    }
    else {
        await usersService.create(req.body);
        res.status(204).send();
    }
}

const update = async (req: ValidatedRequest<PutUserSchema>, res: Response) => {
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

const remove = async (req: Request, res: Response) => {
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

const limit = async (req: ValidatedRequest<LimitUsersSchema>, res: Response) => {
    const { login } = req.params;
    const { limit } = req.query;
    const users = await Container.get(UsersService).autoSuggest(login, limit ? +limit : undefined);
    res.json(users);
}

export { create, getById, limit, remove, update };