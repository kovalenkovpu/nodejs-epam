import { ValidationError } from 'joi';

const formatError = (error: ValidationError): Error | string[] => {
  if (!error.isJoi) {
    return error;
  }

  return error.details.map(({ message }) => message);
};

export { formatError };
