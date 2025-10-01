"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
    async up(queryInterface) {
        const now = new Date();

        // 1. Insert Organizations
        await queryInterface.bulkInsert("organization", [
            {
                org_id: "11111111-1111-1111-1111-111111111111",
                name: "BluOcean",
                desc: "BluOcean",
                created_by: null,
                modified_by: null,
                created_date: now,
                modified_date: now,
                is_deleted: false,
            },
            {
                org_id: "22222222-2222-2222-2222-222222222222",
                name: "CDW",
                desc: "CDW",
                created_by: null,
                modified_by: null,
                created_date: now,
                modified_date: now,
                is_deleted: false,
            },
            {
                org_id: "33333333-3333-3333-3333-333333333333",
                name: "Affirm",
                desc: "Affirm",
                created_by: null,
                modified_by: null,
                created_date: now,
                modified_date: now,
                is_deleted: false,
            },
        ]);

        // 2. Insert Organization Assets
        await queryInterface.bulkInsert("organization_asset", [
            {
                org_asset_id: uuidv4(),
                org_id: "11111111-1111-1111-1111-111111111111",
                name: "Asset A",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: now,
                modified_date: now,
                is_deleted: false,
            },
            {
                org_asset_id: uuidv4(),
                org_id: "11111111-1111-1111-1111-111111111111",
                name: "Asset B",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: now,
                modified_date: now,
                is_deleted: false,
            },
            {
                org_asset_id: uuidv4(),
                org_id: "22222222-2222-2222-2222-222222222222",
                name: "Asset X",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: now,
                modified_date: now,
                is_deleted: false,
            },
            {
                org_asset_id: uuidv4(),
                org_id: "22222222-2222-2222-2222-222222222222",
                name: "Asset Y",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: now,
                modified_date: now,
                is_deleted: false,
            },
        ]);

        // 3. Insert Business Units
        await queryInterface.bulkInsert("organization_business_unit", [
            {
                org_business_unit_id: "11111111-1111-1111-1111-111111111112",
                org_id: "11111111-1111-1111-1111-111111111111",
                name: "Technology",
                created_by: null,
                modified_by: null,
                created_date: now,
                modified_date: now,
                is_deleted: false,
            },
            {
                org_business_unit_id: "22222222-2222-2222-2222-222222222223",
                org_id: "22222222-2222-2222-2222-222222222222",
                name: "Retail Banking",
                created_by: null,
                modified_by: null,
                created_date: now,
                modified_date: now,
                is_deleted: false,
            },
            {
                org_business_unit_id: "22222222-2222-2222-2222-222222222224",
                org_id: "22222222-2222-2222-2222-222222222222",
                name: "Loan Services",
                created_by: null,
                modified_by: null,
                created_date: now,
                modified_date: now,
                is_deleted: false,
            },
            {
                org_business_unit_id: "33333333-3333-3333-3333-333333333334",
                org_id: "33333333-3333-3333-3333-333333333333",
                name: "Risk Management",
                created_by: null,
                modified_by: null,
                created_date: now,
                modified_date: now,
                is_deleted: false,
            },
        ]);

        // 4. Insert Processes
        await queryInterface.bulkInsert("organization_process", [
            {
                org_process_id: "11111111-1111-1111-1111-111111111113",
                org_id: "11111111-1111-1111-1111-111111111111",
                org_business_unit_id: "11111111-1111-1111-1111-111111111112",
                name: "Customer Onboarding",
                created_by: null,
                modified_by: null,
                created_date: now,
                modified_date: now,
                is_deleted: false,
            },
            {
                org_process_id: "22222222-2222-2222-2222-222222222225",
                org_id: "22222222-2222-2222-2222-222222222222",
                org_business_unit_id: "22222222-2222-2222-2222-222222222224",
                name: "Account Management Process",
                created_by: null,
                modified_by: null,
                created_date: now,
                modified_date: now,
                is_deleted: false,
            },
        ]);

        // 5. Insert Risk Scenarios
        const riskScenarios = [];
        for (let i = 0; i <= 26; i++) {
            const code = `RS-${1000 + i}`;
            riskScenarios.push({
                org_risk_id: uuidv4(),
                org_id: "22222222-2222-2222-2222-222222222222",
                risk_code: code,
                name: `Risk Scenario ${i}`,
                description: `Description for ${code}`,
                statement: `Statement for ${code}`,
                status: "Active",
                field1: "High Impact",
                field2: "External Threat",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: now,
                modified_date: now,
                is_deleted: false,
            });
        }
        await queryInterface.bulkInsert("organization_risk_scenario", riskScenarios);

        // 6. Insert Taxonomies
        await queryInterface.bulkInsert("taxonomy", [
            {
                taxonomy_id: "11111111-1111-1111-1111-111111111111",
                org_id: "11111111-1111-1111-1111-111111111111",
                name: "Financial Impact",
                is_deleted: false,
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: now,
                modified_date: now,
                weightage: 10,
            },
            {
                taxonomy_id: "22222222-2222-2222-2222-222222222222",
                org_id: "11111111-1111-1111-1111-111111111111",
                name: "Regulatory",
                is_deleted: false,
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: now,
                modified_date: now,
                weightage: 20,
            },
            {
                taxonomy_id: "33333333-3333-3333-3333-333333333333",
                org_id: "11111111-1111-1111-1111-111111111111",
                name: "Reputational",
                is_deleted: false,
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: now,
                modified_date: now,
                weightage: 30,
            },
            {
                taxonomy_id: "44444444-4444-4444-4444-444444444444",
                org_id: "11111111-1111-1111-1111-111111111111",
                name: "Operational",
                is_deleted: false,
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: now,
                modified_date: now,
                weightage: 40,
            },
        ]);

        // 7. Insert Severity Levels
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

    async down(queryInterface) {
        await queryInterface.bulkDelete("severity_level", null, {});
        await queryInterface.bulkDelete("taxonomy", null, {});
        await queryInterface.bulkDelete("organization_risk_scenario", null, {});
        await queryInterface.bulkDelete("organization_process", null, {});
        await queryInterface.bulkDelete("organization_business_unit", null, {});
        await queryInterface.bulkDelete("organization_asset", null, {});
        await queryInterface.bulkDelete("organization", null, {});
    },
};
