module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserGroups', {
      user_id: {
        type: Sequelize.UUID,
      },
      group_id: {
        type: Sequelize.UUID,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('UserGroups');
  },
};
