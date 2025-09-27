"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        // Add weightage to taxonomy
        await queryInterface.addColumn("taxonomy", "weightage", {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0, // fallback for existing rows
        });

        // Add color to severity_level
        await queryInterface.addColumn("severity_level", "color", {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        // Remove weightage from taxonomy
        await queryInterface.removeColumn("taxonomy", "weightage");

        // Remove color from severity_level
        await queryInterface.removeColumn("severity_level", "color");
    },
};
