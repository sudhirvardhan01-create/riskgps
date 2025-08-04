'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('library_meta_datas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      input_type: {
        type: Sequelize.ENUM('text', 'select', 'multiselect', 'number'),
        allowNull: false,
        defaultValue: 'multiselect',
      },
      supported_values: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      applies_to: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
        defaultValue: ['all'],
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('library_meta_datas');
  },
};
