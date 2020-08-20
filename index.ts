import express, { NextFunction, Request, Response } from 'express';
import { UserRouter } from './routes/users'

const app = express();
const PORT = 8000;

app.set('x-powered-by', false);

app.use(express.json());

app.use('/users', UserRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});