const commonFields = require("./common_fields");

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
                field: "organization_id",
            },
            ...commonFields,
        },
        {
            tableName: "taxonomy",
            timestamps: false,
        }
    );

    Taxonomy.associate = (models) => {
        // one taxonomy belongs to an organization
        Taxonomy.belongsTo(models.Organization, {
            foreignKey: "organizationId",
            targetKey: "organizationId",
            as: "organization",
        });

        // optional: one taxonomy can have many children (if hierarchical)
        // Taxonomy.hasMany(models.Taxonomy, {
        //     foreignKey: "parentId",
        //     as: "children",
        // });
    };

    return Taxonomy;
};
