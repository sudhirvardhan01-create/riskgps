"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const tables = [
            "library_threat_bundle",
        ];

        for (const table of tables) {
            // created_by
            await queryInterface.addColumn(table, "created_by", {
                type: Sequelize.UUID,
                allowNull: true,
            });

            // modified_by
            await queryInterface.addColumn(table, "modified_by", {
                type: Sequelize.UUID,
                allowNull: true,
            });

            // created_date
            await queryInterface.addColumn(table, "created_date", {
                type: Sequelize.DATE,
                allowNull: false,
            });

            // modified_date
            await queryInterface.addColumn(table, "modified_date", {
                type: Sequelize.DATE,
                allowNull: false,
            });

            // is_deleted
            await queryInterface.addColumn(table, "is_deleted", {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            });
        }
    },

    async down(queryInterface, Sequelize) {
        const tables = [
            "library_threat_bundle",
        ];

        for (const table of tables) {
            await queryInterface.removeColumn(table, "created_by");
            await queryInterface.removeColumn(table, "modified_by");
            await queryInterface.removeColumn(table, "created_date");
            await queryInterface.removeColumn(table, "modified_date");
            await queryInterface.removeColumn(table, "is_deleted");
        }
    },
};
