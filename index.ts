import express, { NextFunction, Request, Response } from 'express';
import { UserRouter } from './routes/users'
import { ValidationError } from '@hapi/joi';

const app = express();
const PORT = 8000;

app.set('x-powered-by', false);

app.use(express.json());

app.use('/users', UserRouter);

/*app.use((err: { error: Error }, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  let bad = "bad";
  res.status(400).json({ bad });
});*/

app.listen(PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});