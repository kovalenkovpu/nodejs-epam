// TODO: change it when migration is being implemented
const config = {
  development: {
    username: 'postgres',
    password: null,
    database: 'nodejs-epam',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
};

export { config };
