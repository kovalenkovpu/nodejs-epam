import Joi from 'joi';
import isEmpty from 'lodash/isEmpty';
import isUUID from 'validator/lib/isUUID';

import { PERMISSIONS } from '../constants';
import { GroupBase } from '../types/group-dto';

const UUID_VERSION = 4;

const groupIdSchema = Joi.string()
  .custom((id: string) => {
    if (!isUUID(id, UUID_VERSION)) {
      throw new Error();
    }

    return id;
  })
  .message('"id" is not a valid UUIDv4 string');

const groupSchema = Joi.object<GroupBase>({
  name: Joi.string().trim().required(),
  permissions: Joi.array()
    .custom((permissions: string[]) => {
      const unknownPermissions = permissions.filter(
        (permission) => !Object.values(PERMISSIONS).includes(permission)
      );

      if (!isEmpty(permissions) && !isEmpty(unknownPermissions)) {
        throw new Error();
      }

      return permissions;
    })
    .message('"permissions" has unknown permission'),
});

const groupNameSchema = Joi.array()
  .unique('name', { ignoreUndefined: true })
  .messages({
    'string.unique': '"name" is not unique',
  });

export { groupIdSchema, groupSchema, groupNameSchema };
