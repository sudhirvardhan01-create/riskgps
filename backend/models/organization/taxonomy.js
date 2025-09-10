const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
    const Taxonomy = sequelize.define(
        "Taxonomy",
        {
            taxonomyId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                field: "taxonomy_id",
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "name",
            },
            organizationId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: "org_id", // alias → DB column
            },
            ...commonFields, // createdBy, modifiedBy, createdDate, modifiedDate, isDeleted
        },
        {
            tableName: "taxonomy",
            timestamps: false, // audit fields handled manually
        }
    );

    Taxonomy.associate = (models) => {
        // belongsTo Organization
        Taxonomy.belongsTo(models.Organization, {
            foreignKey: "organizationId",
            targetKey: "organizationId",
            as: "organizationForTaxonomies",
        });

        // Organization hasMany Taxonomy
        if (models.Organization) {
            models.Organization.hasMany(Taxonomy, {
                foreignKey: "organizationId",
                sourceKey: "organizationId",
                as: "organizationTaxonomies",
            });
        }
    };

    return Taxonomy;
};
