import Container from "typedi";
import { Request, Response } from "express";
import GroupsService from "../../services/groups.service";
import { ValidatedRequest } from "express-joi-validation";
import { AddGroupSchema, PutGroupSchema } from "../schemas/groups/validated";

const getAll = async (req: Request, res: Response) => {
    const groups = await Container.get(GroupsService).getAll();
    res.json(groups);
}

const create = async (req: ValidatedRequest<AddGroupSchema>, res: Response) => {
    await Container.get(GroupsService).create(req.body);
    res.status(204).send();
}

const update = async (req: ValidatedRequest<PutGroupSchema>, res: Response) => {
    await Container.get(GroupsService).update(+req.params.id, req.body);
    res.status(204).send();
}

const remove = async (req: Request, res: Response) => {
    await Container.get(GroupsService).delete(+req.params.id);
    res.status(204).send();
}

export { create, getAll, remove, update };