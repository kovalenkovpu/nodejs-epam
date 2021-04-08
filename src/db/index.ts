import { Sequelize } from 'sequelize';
import process from 'process';

import { initUserTable } from './models/user';
import { IDB, InitDBConnenction } from './types/db.types';

const dialectOptions =
  process.env.NODE_ENV === 'production'
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : undefined;

const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions,
});

const initDBConnenction: InitDBConnenction = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the DB has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the DB:', error);
  }
};

const db: IDB = {
  sequelize,
  initDBConnenction,
  User: initUserTable(sequelize),
};

export { db };
