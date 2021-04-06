# nodejs-epam

## TASK 3.1

- Install DB PostgreSQL on your machine or use a free web hosting services for PostgreSQL (https://www.heroku.com/postgres or https://www.elephantsql.com/plans.html).
- Write SQL script which will create Users table in the DB and fill it in with predefined users collection.
- Configure your REST service to work with PostgreSQL.

  - Use the sequelize package (http://docs.sequelizejs.com/) as ORM to work with PostgreSQL.

  As an alternative to sequelize you can use more low-level query-builder library (http://knexjs.org/).

## TASK 3.2

The service should adhere to 3-layer architecture principles (https://softwareontheroad.com/ideal-nodejs-project-structure/) and contain the following set of directories:

```
|- routers / controllers
|- services
|- data-access
|- models
```
