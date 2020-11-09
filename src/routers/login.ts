import express from 'express';
import UsersService from '../services/users.service';
import { Container } from 'typedi';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/', async (req, res) => {
    const {username, password} = req.body;
    const usersService = Container.get(UsersService);

    const user = await usersService.getByLogin(username);
    if (!user || user.password !== password) {
        return res.status(401).send({
            message: 'Invalid username and/or password.'
        });
    }

    const payload = { name: user.login };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: 120 });
    res.send(token);
});

export default router;