import { NextFunction, Request, Response } from 'express';

const cyanFontColor = '\x1b[36m%s\x1b[0m';

const consoleLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { method, query, path } = req;
  const queryParamsString = Object.entries(query)
    .map(([key, value]) => `${key}=${value}`)
    .join();

  let log = `[consoleLogger] Request: ${method} ${path}`;

  if (queryParamsString) {
    log = log.concat(` Params: ${queryParamsString}`);
  }

  console.log(cyanFontColor, log);

  return next();
};

export { consoleLogger };
