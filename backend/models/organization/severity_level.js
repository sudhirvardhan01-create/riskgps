const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
    const SeverityLevel = sequelize.define(
        "SeverityLevel",
        {
            severityId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                field: "severity_id",
            },
            taxonomyId: {
                type: DataTypes.UUID,
                allowNull: false,
                field: "taxonomy_id", // FK to Taxonomy
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "name",
            },
            minRange: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "min_range",
            },
            maxRange: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "max_range",
            },
            color: {
                type: DataTypes.STRING,
                allowNull: true,
                field: "color",
            },
            ...commonFields, // createdBy, modifiedBy, createdDate, modifiedDate, isDeleted
        },
        {
            tableName: "severity_level",
            timestamps: false, // we manage audit fields manually
        }
    );

    SeverityLevel.associate = (models) => {
        // belongsTo Taxonomy
        SeverityLevel.belongsTo(models.Taxonomy, {
            foreignKey: "taxonomyId",
            targetKey: "taxonomyId",
            as: "taxonomyDetails",
        });

        // Taxonomy hasMany SeverityLevels
        if (models.Taxonomy) {
            models.Taxonomy.hasMany(SeverityLevel, {
                foreignKey: "taxonomyId",
                sourceKey: "taxonomyId",
                as: "severityLevels",
            });
        }
    };

    return SeverityLevel;
};
