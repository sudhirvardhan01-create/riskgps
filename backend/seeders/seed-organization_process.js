"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert("organization_process", [
            {
                org_process_id: uuidv4(),
                org_id: "11111111-1111-1111-1111-111111111111", // Replace with actual org_id from organization table
                org_business_unit_id: "25ccf046-449c-4324-8333-b9be46613aa2", // Replace with actual business_unit_id
                name: "Customer Onboarding",
                created_by: null,
                modified_by: null,
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
            },
            {
                org_process_id: uuidv4(),
                org_id: "22222222-2222-2222-2222-222222222222",
                org_business_unit_id: "2fa8a440-fe62-4267-9776-3a1c87b3bffa",
                name: "Loan Approval",
                created_by: null,
                modified_by: null,
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
            },
            {
                org_process_id: uuidv4(),
                org_id: "22222222-2222-2222-2222-222222222222",
                org_business_unit_id: "34b8e383-d200-47c3-a81d-8bee2fa1daaa",
                name: "Fraud Detection",
                created_by: null,
                modified_by: null,
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
            },
            {
                org_process_id: uuidv4(),
                org_id: "33333333-3333-3333-3333-333333333333",
                org_business_unit_id: "3d1a07e1-f6a3-41ec-ad14-b3fffdde41fa",
                name: "IT Change Management",
                created_by: null,
                modified_by: null,
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("organization_process", null, {});
    },
};
