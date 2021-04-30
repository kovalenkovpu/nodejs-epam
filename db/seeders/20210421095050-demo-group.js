module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('Groups', [
      {
        id: '1e1241ac-784d-4b92-9dda-fcf2166c66f4',
        name: 'group_users_r',
        permissions: ['READ'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'bb54c948-5327-4945-b877-2ad46e302595',
        name: 'group_users_w',
        permissions: ['WRITE'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '5097fafc-d858-4da9-8bcd-7f5131fca21b',
        name: 'group_users_d',
        permissions: ['DELETE'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '104868cf-2b7b-4a0e-9316-c54d6b9dcf04',
        name: 'group_admin',
        permissions: ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('Groups', null, {});
  },
};
