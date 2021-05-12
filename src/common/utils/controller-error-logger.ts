import { Dictionary } from 'lodash';
import { logger } from './logger';

const controllerErrorLogger = ({
  controllerName,
  methodName,
  args,
  errorMessage,
}: {
  controllerName: string;
  methodName: string;
  args: Dictionary<any>;
  errorMessage: string;
}): void => {
  console.log('HHHHHHEEEEEY!');
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
