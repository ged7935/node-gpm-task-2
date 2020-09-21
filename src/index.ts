import "reflect-metadata";
import express from 'express';
import UserRouter from './routers/users';
import GroupRouter from './routers/groups';
import UserGroupRouter from './routers/usergroup';
import loadDb from './db.loader';

const app = express();
const PORT = 8000;

app.set('x-powered-by', false);

app.use(express.json());

loadDb();

app.use('/users', UserRouter);
app.use('/groups', GroupRouter);
app.use('/usergroup', UserGroupRouter);

app.listen(PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
