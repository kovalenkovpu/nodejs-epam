import { DataTypes, Sequelize } from 'sequelize';

import { initGroup } from './group';
import { IDataBase } from './types';
import { initUser } from './user';

const env = process.env.NODE_ENV || 'development';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require(`${__dirname}/../config/config.js`)[env];

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(
    process.env[config.use_env_variable] as string,
    config
  );
} else {
  sequelize = new Sequelize(config.url, config);
}

const db: IDataBase = {
  User: initUser(sequelize, DataTypes),
  Group: initGroup(sequelize, DataTypes),
  sequelize,
};

(Object.keys(db) as Array<keyof typeof db>).forEach((modelName) => {
  if (modelName !== 'sequelize') {
    db[modelName].associate(db);
  }
});

export default db;
