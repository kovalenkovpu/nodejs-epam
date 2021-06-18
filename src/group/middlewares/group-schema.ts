import Joi from 'joi';
import isEmpty from 'lodash/isEmpty';

import { PERMISSIONS } from '../constants';
import { GroupBase, Permission } from '../types/group-dto';

const groupSchema = Joi.object<GroupBase>({
  name: Joi.string().trim().required(),
  permissions: Joi.array()
    .custom((permissions: Permission[]) => {
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
  .message('"name" is not unique');

export { groupSchema, groupNameSchema };
