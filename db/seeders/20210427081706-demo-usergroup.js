module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('UserGroups', [
      {
        id: 'ee11b080-8b50-4433-8aef-780db10b5ff3',
        user_id: 'caeb043d-54e9-48b7-a8d2-f559ba4af5a8',
        group_id: '104868cf-2b7b-4a0e-9316-c54d6b9dcf04',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '98e5c353-e11f-4d8a-9e37-898add682abe',
        user_id: 'caeb043d-54e9-48b7-a8d2-f559ba4af5a8',
        group_id: 'bb54c948-5327-4945-b877-2ad46e302595',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '38c10596-fa53-4e92-b3eb-a67abe8e9e49',
        user_id: 'a324aa55-7c65-441c-b8d0-40619d795851',
        group_id: '1e1241ac-784d-4b92-9dda-fcf2166c66f4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '473b84e0-a25a-4950-b2f4-81ec806da63a',
        user_id: '4c45a6eb-8423-44f2-87f2-30c8fac14abd',
        group_id: '1e1241ac-784d-4b92-9dda-fcf2166c66f4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '813244a6-4a12-4614-b6ad-02aac6b2a53a',
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
