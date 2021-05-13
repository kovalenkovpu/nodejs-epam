import { logger } from './logger';

const controllerErrorLogger = ({
  controllerName,
  methodName,
  args,
  errorMessage,
}: {
  controllerName: string;
  methodName: string;
  args: Record<string, any>;
  errorMessage: string;
}): void => {
  logger.log(
    'error',
    '"%s" error. Method name: "%s", message: "%s", arguments: "%o"',
    controllerName,
    methodName,
    errorMessage,
    args
  );
};

export { controllerErrorLogger };
