"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
    async up(queryInterface, Sequelize) {
        // Insert taxonomies first
        await queryInterface.bulkInsert("taxonomy", [
            {
                taxonomy_id: "11111111-1111-1111-1111-111111111111",
                org_id: "11111111-1111-1111-1111-111111111111",
                name: "Financial Impact",
                is_deleted: false,
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                weightage: 10
            },
            {
                taxonomy_id: "22222222-2222-2222-2222-222222222222",
                org_id: "11111111-1111-1111-1111-111111111111",
                name: "Regulatory",
                is_deleted: false,
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                weightage: 20
            },
            {
                taxonomy_id: "33333333-3333-3333-3333-333333333333",
                org_id: "11111111-1111-1111-1111-111111111111",
                name: "Reputational",
                is_deleted: false,
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                weightage: 30
            },
            {
                taxonomy_id: "44444444-4444-4444-4444-444444444444",
                org_id: "11111111-1111-1111-1111-111111111111",
                name: "Operational",
                is_deleted: false,
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                weightage: 40
            }
        ]);

        // Insert severity levels linked to taxonomy
        await queryInterface.bulkInsert("severity_level", [
            {
                severity_id: uuidv4(),
                taxonomy_id: "11111111-1111-1111-1111-111111111111",
                name: "Very Low",
                min_range: "50k",
                max_range: "100k",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
                color: "#3BB966"
            },
            {
                severity_id: uuidv4(),
                taxonomy_id: "11111111-1111-1111-1111-111111111111",
                name: "Low",
                min_range: "100k",
                max_range: "200k",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
                color: "#3366CC"
            },
            {
                severity_id: uuidv4(),
                taxonomy_id: "11111111-1111-1111-1111-111111111111",
                name: "Moderate",
                min_range: "200k",
                max_range: "500k",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
                color: "#E3B52A"
            },
            {
                severity_id: uuidv4(),
                taxonomy_id: "11111111-1111-1111-1111-111111111111",
                name: "High",
                min_range: "500k",
                max_range: "1000k",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
                color: "#DA7706"
            },
            {
                severity_id: uuidv4(),
                taxonomy_id: "11111111-1111-1111-1111-111111111111",
                name: "Critical",
                min_range: "",
                max_range: ">1000k",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
                color: "#B90D0D"
            },
            {
                severity_id: uuidv4(),
                taxonomy_id: "22222222-2222-2222-2222-222222222222",
                name: "Very Low",
                min_range: "50k",
                max_range: "100k",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
                color: "#3BB966"
            },
            {
                severity_id: uuidv4(),
                taxonomy_id: "22222222-2222-2222-2222-222222222222",
                name: "Low",
                min_range: "100k",
                max_range: "200k",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
                color: "#3366CC"
            },
            {
                severity_id: uuidv4(),
                taxonomy_id: "22222222-2222-2222-2222-222222222222",
                name: "Moderate",
                min_range: "200k",
                max_range: "500k",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
                color: "#E3B52A"
            },
            {
                severity_id: uuidv4(),
                taxonomy_id: "22222222-2222-2222-2222-222222222222",
                name: "High",
                min_range: "500k",
                max_range: "1000k",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
                color: "#DA7706"
            },
            {
                severity_id: uuidv4(),
                taxonomy_id: "22222222-2222-2222-2222-222222222222",
                name: "Critical",
                min_range: "",
                max_range: ">1000k",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
                color: "#B90D0D"
            },
            {
                severity_id: uuidv4(),
                taxonomy_id: "33333333-3333-3333-3333-333333333333",
                name: "Very Low",
                min_range: "50k",
                max_range: "100k",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
                color: "#3BB966"
            },
            {
                severity_id: uuidv4(),
                taxonomy_id: "33333333-3333-3333-3333-333333333333",
                name: "Low",
                min_range: "100k",
                max_range: "200k",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
                color: "#3366CC"
            },
            {
                severity_id: uuidv4(),
                taxonomy_id: "33333333-3333-3333-3333-333333333333",
                name: "Moderate",
                min_range: "200k",
                max_range: "500k",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
                color: "#E3B52A"
            },
            {
                severity_id: uuidv4(),
                taxonomy_id: "33333333-3333-3333-3333-333333333333",
                name: "High",
                min_range: "500k",
                max_range: "1000k",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
                color: "#DA7706"
            },
            {
                severity_id: uuidv4(),
                taxonomy_id: "33333333-3333-3333-3333-333333333333",
                name: "Critical",
                min_range: "",
                max_range: ">1000k",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
                color: "#B90D0D"
            },
            {
                severity_id: uuidv4(),
                taxonomy_id: "44444444-4444-4444-4444-444444444444",
                name: "Very Low",
                min_range: "50k",
                max_range: "100k",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
                color: "#3BB966"
            },
            {
                severity_id: uuidv4(),
                taxonomy_id: "44444444-4444-4444-4444-444444444444",
                name: "Low",
                min_range: "100k",
                max_range: "200k",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
                color: "#3366CC"
            },
            {
                severity_id: uuidv4(),
                taxonomy_id: "44444444-4444-4444-4444-444444444444",
                name: "Moderate",
                min_range: "200k",
                max_range: "500k",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
                color: "#E3B52A"
            },
            {
                severity_id: uuidv4(),
                taxonomy_id: "44444444-4444-4444-4444-444444444444",
                name: "High",
                min_range: "500k",
                max_range: "1000k",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
                color: "#DA7706"
            },
            {
                severity_id: uuidv4(),
                taxonomy_id: "44444444-4444-4444-4444-444444444444",
                name: "Critical",
                min_range: "",
                max_range: ">1000k",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
                color: "#B90D0D"
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("severity_level", null, {});
        await queryInterface.bulkDelete("taxonomy", null, {});
    },
};
