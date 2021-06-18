# nodejs-epam

## Create DB and add `.env` file

- create Postgres database with your login and password
- add `.env` file to the root of the project, with the following structure:

```
NODE_ENV=development
PORT=<your_dev_port>
DATABASE_URL=postgres://<login>:<password>@localhost:5432/<database_name>
PERF_TRACK=true // for logging execution time of controller methods
SECRET=<any_string_here> // used for JWT token generation
```

## Install dependencies

- run `npm install` command

## Run migrations and seeds

- When launching the application the first time, run `npm run start:dev:seed` which will apply migrations and add seeds to DB. After that the application will run on a specified port

- The next time you run the application locally, seeds are not needed, just run: `npm run start:dev` which will apply migrations and launches the aplication on a specified port

## Code quality checks

- run `npm run test` to run tests and generate code coverage report
- run `npm run lint:all` for performing code checks (linters, TS, tests)
