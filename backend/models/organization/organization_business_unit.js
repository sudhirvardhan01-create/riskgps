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
        field: "org_id",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "name",
      },
      desc: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "description",
      },
      head: {
        type: DataTypes.JSONB, // stores { name, email }
        allowNull: true,
        field: "head",
      },
      pocBiso: {
        type: DataTypes.JSONB, // stores { name, email }
        allowNull: true,
        field: "poc_biso",
      },
      itPoc: {
        type: DataTypes.JSONB, // stores { name, email }
        allowNull: true,
        field: "it_poc",
      },
      financeLead: {
        type: DataTypes.JSONB, // stores { name, email }
        allowNull: true,
        field: "finance_lead",
      },
      tags: {
        type: DataTypes.JSONB, // stores [{ key, value }, ...]
        allowNull: true,
        field: "tags",
      },
      ...commonFields, // createdBy, modifiedBy, createdDate, modifiedDate, isDeleted
    },
    {
      tableName: "organization_business_unit",
      timestamps: false,
    }
  );

  OrganizationBusinessUnit.associate = (models) => {
    // Belongs to Organization
    OrganizationBusinessUnit.belongsTo(models.Organization, {
      foreignKey: "organizationId",
      targetKey: "organizationId",
      as: "organizationDetails",
    });

    // One Organization -> Many Business Units
    if (models.Organization) {
      models.Organization.hasMany(OrganizationBusinessUnit, {
        foreignKey: "organizationId",
        sourceKey: "organizationId",
        as: "organizationBusinessUnits",
      });
    }
  };

  return OrganizationBusinessUnit;
};
