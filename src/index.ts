import "reflect-metadata";
import express from 'express';
import UserRouter from './routers/users';
import loadDb from './db.loader';
import Container from "typedi";

const app = express();
const PORT = 8000;

app.set('x-powered-by', false);

app.use(express.json());

loadDb();

app.use('/users', UserRouter);

app.listen(PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
