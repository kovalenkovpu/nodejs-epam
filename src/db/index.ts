import { Sequelize } from 'sequelize';
import process from 'process';

const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: 'postgres',
  dialectOptions: {
    ssl: true,
    rejectUnauthorized: false,
  },
});

const initDBConnenction = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    // eslint-disable-next-line no-undef
    console.log('Connection to the DB has been established successfully.');
  } catch (error) {
    // eslint-disable-next-line no-undef
    console.error('Unable to connect to the DB:', error);
  }
};

export { initDBConnenction, sequelize };
