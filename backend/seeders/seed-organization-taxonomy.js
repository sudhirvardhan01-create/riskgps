"use strict";
const { Organization, Taxonomy } = require("../models");
const { safeSeed } = require("../utils/seedHelper");

module.exports = {
    async up() {
        const org = await Organization.findOne({
            where: { name: "Default Org 1" },
        });

        if (!org) {
            console.warn("No organization found with name 'Default Org 1'. Seed skipped.");
            return;
        }

        const taxonomy = [
            {
                organizationId: org.organizationId,
                name: "Financial Impact",
                weightage: 10,
                order: 1,
                isEdited: false,
                isActive: true,
            },
            {
                organizationId: org.organizationId,
                name: "Regulatory",
                weightage: 20,
                order: 2,
                isEdited: false,
                isActive: true,
            },
            {
                organizationId: org.organizationId,
                name: "Reputational",
                weightage: 30,
                order: 3,
                isEdited: false,
                isActive: true,
            },
            {
                organizationId: org.organizationId,
                name: "Operational",
                weightage: 40,
                order: 4,
                isEdited: false,
                isActive: true,
            },
        ];

        await safeSeed(Taxonomy, taxonomy, "name");
    },

    async down() {
        await Taxonomy.destroy({ truncate: true, cascade: true });
    },
};
