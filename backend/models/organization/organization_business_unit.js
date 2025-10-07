const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
  const OrganizationBusinessUnit = sequelize.define(
    "OrganizationBusinessUnit",
    {
      orgBusinessUnitId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: "org_business_unit_id",
      },
      organizationId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "org_id", // DB column, alias remains organizationId
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "name",
      },
      desc: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "desc",
      },
      ...commonFields, // adds createdBy, modifiedBy, createdDate, modifiedDate, isDeleted
    },
    {
      tableName: "organization_business_unit",
      timestamps: false, // we manage timestamps manually
    }
  );

  OrganizationBusinessUnit.associate = (models) => {
    // belongsTo Organization
    OrganizationBusinessUnit.belongsTo(models.Organization, {
      foreignKey: "organizationId", // alias, maps to org_id
      targetKey: "organizationId",
      as: "organizationDetails",
    });

    // One Organization -> Many Business Units
    if (models.Organization) {
      models.Organization.hasMany(OrganizationBusinessUnit, {
        foreignKey: "organizationId", // alias
        sourceKey: "organizationId",
        as: "organizationBusinessUnits",
      });
    }
  };

  return OrganizationBusinessUnit;
};
