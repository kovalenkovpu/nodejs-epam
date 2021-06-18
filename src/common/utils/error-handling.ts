import { ValidationError } from 'joi';

import { CustomError } from '../types/error-handling';

const formatError = (error: ValidationError): string[] => {
  if (!error.isJoi) {
    return [error.message];
  }

  return error.details.map(({ message }) => message);
};

const generateNotFoundError = (id: string, entity: string): CustomError => {
  const error: CustomError = new Error(`${entity} with id: ${id} not found`);
  error.isNotFound = true;

  return error;
};

export { formatError, generateNotFoundError };
