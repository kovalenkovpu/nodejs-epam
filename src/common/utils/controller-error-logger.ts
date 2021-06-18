import { logger } from './logger';

const controllerErrorLogger = ({
  controllerName,
  methodName,
  args,
  error,
}: {
  controllerName: string;
  methodName: string;
  args: Record<string, any>;
  error: Error;
}): void => {
  logger.log(
    'error',
    // eslint-disable-next-line max-len
    '"%s" error. Method name: "%s", arguments: "%o", message: "%s", stacktrace: "%s"',
    controllerName,
    methodName,
    args,
    error.message,
    error.stack
  );
};

export { controllerErrorLogger };
