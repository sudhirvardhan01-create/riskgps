const commonFields = require("./common_fields");

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
                field: "taxonomy_id",
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
            ...commonFields,
        },
        {
            tableName: "severity_level",
            timestamps: false,
        }
    );

    SeverityLevel.associate = (models) => {
        // one severity level belongs to a taxonomy
        SeverityLevel.belongsTo(models.Taxonomy, {
            foreignKey: "taxonomyId",
            targetKey: "taxonomyId",
            as: "taxonomy",
        });
    };

    return SeverityLevel;
};
