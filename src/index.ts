import express from 'express';
import process from 'process';
import dotenv from 'dotenv';
dotenv.config();

// Routers
import { userRouter } from './user/user-router';
import { initDBConnenction } from './db';

const app = express();

app.use(express.json());
app.use('/api/user', userRouter);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-undef
  console.log(`Server is running on port ${process.env.PORT}`);

  initDBConnenction();
});
