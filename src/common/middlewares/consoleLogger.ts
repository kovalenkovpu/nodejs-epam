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

  console.log(cyanFontColor, `[consoleLogger] Request: ${method} ${path}`);

  if (queryParamsString) {
    console.log(cyanFontColor, `[consoleLogger] Params: ${queryParamsString}`);
  }

  return next();
};

export { consoleLogger };
