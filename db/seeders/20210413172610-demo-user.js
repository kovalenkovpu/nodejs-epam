module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('Users', [
      {
        id: 'caeb043d-54e9-48b7-a8d2-f559ba4af5a8',
        login: 'petrov',
        password: 'pass1',
        age: 30,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4c45a6eb-8423-44f2-87f2-30c8fac14abd',
        login: 'petr',
        password: '152ttrr',
        age: 20,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'cd8ed104-e92b-4c77-bb1e-37484f7e390a',
        login: 'petrovich',
        password: 'jkhTT77s',
        age: 56,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'a324aa55-7c65-441c-b8d0-40619d795851',
        login: 'ivanov',
        password: '1010jj',
        age: 12,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
