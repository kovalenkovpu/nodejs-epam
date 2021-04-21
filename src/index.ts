import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import db from '../db/models';

// Routers
import { userRouter } from './user/user-router';
import { groupRouter } from './group/group-router';

const app = express();

app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/group', groupRouter);

app.listen(process.env.PORT, async () => {
  console.log(`Server is running on port ${process.env.PORT}`);

  await db.sequelize.authenticate();

  console.log('Connection to DB has been established successfully.');
});
