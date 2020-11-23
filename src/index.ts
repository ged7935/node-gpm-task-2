import "reflect-metadata";
import express, { NextFunction, Request, Response } from 'express';
import LoginRouter from './routers/login';
import UserRouter from './routers/users';
import GroupRouter from './routers/groups';
import UserGroupRouter from './routers/usergroup';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
const PORT = 8000;

app.set('x-powered-by', false);
app.use(express.json());
app.use(cors())

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if(!token) {
    return res.status(401).send({message: 'Token not provided'});
  }
  jwt.verify(token, process.env.JWT_SECRET as string, (err) => {
    if(err) {
      return res.status(403).send({message: 'Invalid token provided.'});
    }    
    next();
  });
};

app.use('/login', LoginRouter);
app.use('/users', validateToken, UserRouter);
app.use('/groups', validateToken, GroupRouter);
app.use('/usergroup', validateToken, UserGroupRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: "An unexpected error occurred." });
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
