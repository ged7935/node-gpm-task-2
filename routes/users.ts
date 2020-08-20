import express from 'express';
import { v4 as uuid } from 'uuid';
import { users } from '../data/users';
import Joi from '@hapi/joi';
import { ValidatedRequest, ValidatedRequestSchema, createValidator } from 'express-joi-validation'
import User from '../models/User';

const validator = createValidator();

const userSchema = Joi.object<User>({
    login: Joi.string().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]+$/).required(),
    age: Joi.number().min(4).max(130).required(),
    isDeleted: Joi.boolean().required()
});

const router = express.Router();

router.get('/', (req, res) => {
    const { substring, limit } = req.query;    
    res.json(
        users.filter(u => u.login.includes(substring as string))
            .sort((u1, u2) => u1.login < u2.login ? -1 : 1)
            .slice(0, limit as any)
    );
});

router.get('/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
        throw new Error('User does not exist.');
    }

    res.json(user);
});

router.post('/', validator.body(userSchema, { passError: true }), (req, res) => {
    if (users.find(u => u.login === req.body.login)) {
        throw new Error('Login already exists.');
    }

    users.push({
        id: uuid(),
        ...req.body
    });
    res.status(204).send();
});

router.patch('/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    users[userIndex] = { ...users[userIndex], ...req.body };
    res.status(204).send();
});

router.delete('/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
        throw new Error('User does not exist.')
    }

    user.isDeleted = true;
    res.status(204).send();
});

export { router as UserRouter };