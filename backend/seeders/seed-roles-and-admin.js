'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert roles
    await queryInterface.bulkInsert('Roles', [
      { id: 1, name: 'Admin', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'User', createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Insert initial admin user
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await queryInterface.bulkInsert('Users', [
      {
        name: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        phone: '1234567890',
        organisation: 'Admin Org',
        message: 'Welcome to the admin dashboard',
        communicationPreference: 'Email',
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { email: 'admin@example.com' }, {});
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
