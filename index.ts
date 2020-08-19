import express from 'express';
import { v4 as uuid } from 'uuid';

const app = express();
const PORT = 8000;
app.get('/', (req, res) => res.send('Express + TypeScript Server'));
app.listen(PORT, () => {
  console.log(process.env.WORTH)
  console.log(uuid());
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});