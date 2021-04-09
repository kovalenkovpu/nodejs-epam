import { Sequelize } from 'sequelize';

import { initUserTable } from './models/user';
import { IDB } from './types/db.types';

const dialectOptions =
  process.env.NODE_ENV === 'production'
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : undefined;

const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions,
});

const db: IDB = {
  sequelize,
  User: initUserTable(sequelize),
};

export { db };
