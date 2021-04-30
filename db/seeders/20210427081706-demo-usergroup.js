module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('UserGroups', [
      {
        user_id: 'caeb043d-54e9-48b7-a8d2-f559ba4af5a8',
        group_id: '104868cf-2b7b-4a0e-9316-c54d6b9dcf04',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 'caeb043d-54e9-48b7-a8d2-f559ba4af5a8',
        group_id: 'bb54c948-5327-4945-b877-2ad46e302595',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 'a324aa55-7c65-441c-b8d0-40619d795851',
        group_id: '1e1241ac-784d-4b92-9dda-fcf2166c66f4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: '4c45a6eb-8423-44f2-87f2-30c8fac14abd',
        group_id: '1e1241ac-784d-4b92-9dda-fcf2166c66f4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 'cd8ed104-e92b-4c77-bb1e-37484f7e390a',
        group_id: '1e1241ac-784d-4b92-9dda-fcf2166c66f4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('UserGroups', null, {});
  },
};
