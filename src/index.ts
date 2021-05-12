import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

import db from '../db/models';

// Loggers, errors middlewares
import {
  consoleLogger,
  serverErrorHandler,
  notFoundErrorHandler,
} from './common/middlewares';
import {
  registerUncoughExceptionHandler,
  registerUnhandledRejectionHandler,
} from './common/utils';
// Routers
import { groupRouter } from './group/group-router';
import { userRouter } from './user/user-router';

const app = express();

app.use(express.json());
app.use(consoleLogger);

app.use('/api/users', userRouter);
app.use('/api/groups', groupRouter);

app.use(notFoundErrorHandler);
app.use(serverErrorHandler);

app.listen(process.env.PORT, async () => {
  registerUncoughExceptionHandler();
  registerUnhandledRejectionHandler();
  console.log(`Server is running on port ${process.env.PORT}`);

  await db.sequelize.authenticate();
  /*
    Reminder:
    "sync()"" or "sync({ force: true })" should not be used with the built-in
    migration tool. Migrations are done fine using sequelize cli.
  */

  console.log('Connection to DB has been established successfully.');
});
