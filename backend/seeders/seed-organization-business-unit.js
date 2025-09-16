"use strict";

module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert("organization_business_unit", [
      {
        org_business_unit_id: "11111111-1111-1111-1111-111111111112",
        org_id: "11111111-1111-1111-1111-111111111111",
        business_unit_name: "Technology",
        created_by: null,
        modified_by: null,
        created_date: new Date(),
        modified_date: new Date(),
        is_deleted: false,
      },
      {
        org_business_unit_id: "22222222-2222-2222-2222-222222222223",
        org_id: "22222222-2222-2222-2222-222222222222",
        business_unit_name: "Retail Banking",
        created_by: null,
        modified_by: null,
        created_date: new Date(),
        modified_date: new Date(),
        is_deleted: false,
      },
      {
        org_business_unit_id: "22222222-2222-2222-2222-222222222224",
        org_id: "22222222-2222-2222-2222-222222222222",
        business_unit_name: "Loan Services",
        created_by: null,
        modified_by: null,
        created_date: new Date(),
        modified_date: new Date(),
        is_deleted: false,
      },
      {
        org_business_unit_id: "33333333-3333-3333-3333-333333333334",
        org_id: "33333333-3333-3333-3333-333333333333",
        business_unit_name: "Risk Management",
        created_by: null,
        modified_by: null,
        created_date: new Date(),
        modified_date: new Date(),
        is_deleted: false,
      },
    ]);
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete("organization_business_unit", null, {});
  },
};
