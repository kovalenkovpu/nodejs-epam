import Joi from 'joi';
import isUUID from 'validator/lib/isUUID';

const UUID_VERSION = 4;

interface Uuidv4Schema {
  (message?: string): Joi.StringSchema;
}

const uuidv4Schema: Uuidv4Schema = (
  message = '"id" is not a valid UUIDv4 string'
) =>
  Joi.string()
    .custom((id: string) => {
      if (!isUUID(id, UUID_VERSION)) {
        throw new Error();
      }

      return id;
    })
    .message(message);

export { uuidv4Schema };
