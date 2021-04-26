import { ValidationError } from 'joi';

const formatError = (error: ValidationError): Error | string[] => {
  if (!error.isJoi) {
    return error;
  }

  return error.details.map(({ message }) => message);
};

interface CustomError extends Error {
  isNotFound?: boolean;
}

const generateNotFoundMessage = (id: string, entity: string): CustomError => {
  const error: CustomError = new Error(`${entity} with id: ${id} not found`);
  error.isNotFound = true;

  return error;
};

export { formatError, generateNotFoundMessage };
