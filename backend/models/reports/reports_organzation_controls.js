const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
  const OrganizationControlScore = sequelize.define(
    "OrganizationControlScore",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: "id",
      },
            orgId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "org_id",
      },
      orgAssetId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "org_asset_id",
      },
      controlRecordRef: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "control_record_ref",
      },
      controlId: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "control_id",
      },
      controlName: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "control_name",
      },
      ciaMapping: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "cia_mapping",
      },
      controlType: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "control_type",
      },
      controlScore: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "control_score",
      },

      ...commonFields, // includes createdBy, modifiedBy, createdDate, modifiedDate, isDeleted, etc.
    },
    {
      tableName: "reports_organization_control_score",
      schema: "public",
      timestamps: false,
    }
  );

  return OrganizationControlScore;
};
