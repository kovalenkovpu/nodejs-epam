import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { db } from './db';

// Routers
import { userRouter } from './user/user-router';

const app = express();

app.use(express.json());
app.use('/api/user', userRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);

  db.initDBConnenction();
});
