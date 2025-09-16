"use strict";

module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert("organization_process", [
      {
        org_process_id: "11111111-1111-1111-1111-111111111113",
        org_id: "11111111-1111-1111-1111-111111111111",
        org_business_unit_id: "11111111-1111-1111-1111-111111111112",
        name: "Customer Onboarding",
        created_by: null,
        modified_by: null,
        created_date: new Date(),
        modified_date: new Date(),
        is_deleted: false,
      },
      {
        org_process_id: "22222222-2222-2222-2222-222222222225",
        org_id: "22222222-2222-2222-2222-222222222222",
        org_business_unit_id: "22222222-2222-2222-2222-222222222224",
        name: "Loan Approval",
        created_by: null,
        modified_by: null,
        created_date: new Date(),
        modified_date: new Date(),
        is_deleted: false,
      },
      {
        org_process_id: "22222222-2222-2222-2222-222222222226",
        org_id: "22222222-2222-2222-2222-222222222222",
        org_business_unit_id: "22222222-2222-2222-2222-222222222224",
        name: "Fraud Detection",
        created_by: null,
        modified_by: null,
        created_date: new Date(),
        modified_date: new Date(),
        is_deleted: false,
      },
      {
        org_process_id: "33333333-3333-3333-3333-333333333335",
        org_id: "33333333-3333-3333-3333-333333333333",
        org_business_unit_id: "33333333-3333-3333-3333-333333333334",
        name: "IT Change Management",
        created_by: null,
        modified_by: null,
        created_date: new Date(),
        modified_date: new Date(),
        is_deleted: false,
      },
    ]);
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete("organization_process", null, {});
  },
};
