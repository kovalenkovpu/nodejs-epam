import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

import db from '../db/models';

// Loggers, errors middlewares
import {
  consoleLogger,
  serverErrorHandler,
  notFoundErrorHandler,
  authGuard,
} from './common/middlewares';
import {
  registerUncoughExceptionHandler,
  registerUnhandledRejectionHandler,
} from './common/utils';
// Routers
import { groupRouter } from './group/group-router';
import { loginRouter } from './login/login-router';
import { userRouter } from './user/user-router';

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use(consoleLogger);

app.use('/api/login', loginRouter);
app.use('/api/users', authGuard, userRouter);
app.use('/api/groups', authGuard, groupRouter);

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
