"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
    async up(queryInterface) {
        const now = new Date();

        await queryInterface.bulkInsert("organization_risk_scenario", [
            {
                org_risk_id: uuidv4(),
                org_id: "22222222-2222-2222-2222-222222222222", // replace with valid orgId
                risk_code: "RS-001",
                name: "Data Breach",
                description: "Unauthorized access to sensitive customer data",
                statement: "Risk of confidential data being exposed due to weak security controls",
                status: "Active",
                field1: "High Impact",
                field2: "External Threat",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: now,
                modified_date: now,
                is_deleted: false,
            },
            {
                org_risk_id: uuidv4(),
                org_id: "22222222-2222-2222-2222-222222222222", // same orgId for grouping
                risk_code: "RS-002",
                name: "System Downtime",
                description: "Prolonged unavailability of core systems",
                statement: "Risk of business disruption due to infrastructure failure",
                status: "Active",
                field1: "Medium Impact",
                field2: "Internal Threat",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: now,
                modified_date: now,
                is_deleted: false,
            },
            {
                org_risk_id: uuidv4(),
                org_id: "22222222-2222-2222-2222-222222222222", // another orgId
                risk_code: "RS-003",
                name: "Regulatory Non-Compliance",
                description: "Failure to comply with mandatory regulations",
                statement: "Risk of penalties due to non-compliance with GDPR/ISO",
                status: "Inactive",
                field1: "Legal",
                field2: "Compliance",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: now,
                modified_date: now,
                is_deleted: false,
            },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete("organization_risk_scenario", null, {});
    },
};
