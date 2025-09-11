"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert("organization", [
            {
                org_id: "11111111-1111-1111-1111-111111111111",
                name: "BluOcean",
                desc: "BluOcean",
                created_by: null,
                modified_by: null,
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
            },
            {
                org_id: "22222222-2222-2222-2222-222222222222",
                name: "CDW",
                desc: "CDW",
                created_by: null,
                modified_by: null,
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
            },
            {
                org_id: "33333333-3333-3333-3333-333333333333",
                name: "Affirm",
                desc: "Affirm",
                created_by: null,
                modified_by: null,
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("organization", null, {});
    },
};
