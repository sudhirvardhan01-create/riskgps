const { v4: uuidv4 } = require("uuid");

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert("organization_asset", [
            {
                org_asset_id: uuidv4(),
                org_id: "11111111-1111-1111-1111-111111111111",
                name: "Asset A",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
            },
            {
                org_asset_id: uuidv4(),
                org_id: "11111111-1111-1111-1111-111111111111",
                name: "Asset B",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
            },
            {
                org_asset_id: uuidv4(),
                org_id: "22222222-2222-2222-2222-222222222222",
                name: "Asset X",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
            },
            {
                org_asset_id: uuidv4(),
                org_id: "22222222-2222-2222-2222-222222222222",
                name: "Asset Y",
                created_by: uuidv4(),
                modified_by: uuidv4(),
                created_date: new Date(),
                modified_date: new Date(),
                is_deleted: false,
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("organization_asset", null, {});
    },
};
