'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const now = new Date();

        // Insert roles
        const adminRoleId = uuidv4();
        const userRoleId = uuidv4();

        await queryInterface.bulkInsert('role', [
            {
                role_id: adminRoleId,
                name: 'Admin',
                created_by: null,
                modified_by: null,
                created_date: now,
                modified_date: now,
                is_deleted: false
            },
            {
                role_id: userRoleId,
                name: 'User',
                created_by: null,
                modified_by: null,
                created_date: now,
                modified_date: now,
                is_deleted: false
            }
        ]);

        // Insert initial admin user
        const hashedPassword = await bcrypt.hash('Admin@123', 10);
        await queryInterface.bulkInsert('user', [
            {
                user_id: uuidv4(),
                name: 'admin',
                email: 'admin@example.com',
                password: hashedPassword,
                phone: '1234567890',
                organisation: 'Admin Org',
                message: 'Welcome to the admin dashboard',
                communication_preference: 'Email',
                role_id: adminRoleId,
                created_by: null,
                modified_by: null,
                created_date: now,
                modified_date: now,
                is_deleted: false
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('user', { email: 'admin@example.com' }, {});
        await queryInterface.bulkDelete('role', null, {});
    }
};