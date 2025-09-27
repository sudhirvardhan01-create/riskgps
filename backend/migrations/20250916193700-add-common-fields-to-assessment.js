"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const tables = [
            "assessment_process",
            "assessment_process_risk_scenario",
            "assessment_risk_scenario_business_impact",
            "assessment_risk_taxonomy"
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
                allowNull: true
            });

            // modified_date
            await queryInterface.addColumn(table, "modified_date", {
                type: Sequelize.DATE,
                allowNull: true
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
            "organization",
            "assessment_process_risk_scenario",
            "assessment_risk_scenario_business_impact",
            "assessment_risk_taxonomy"
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
