"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("taxonomy", {
            taxonomy_id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.literal("uuid_generate_v4()"),
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            org_id: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            created_by: {
                type: Sequelize.UUID,
                allowNull: true,
            },
            modified_by: {
                type: Sequelize.UUID,
                allowNull: true,
            },
            created_date: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            modified_date: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            is_deleted: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("taxonomy");
    },
};
