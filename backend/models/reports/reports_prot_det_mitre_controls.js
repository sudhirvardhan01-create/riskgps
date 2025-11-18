const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
  const ProtDetMitreControl = sequelize.define(
    "ProtDetMitreControl",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: "id",
      },
      orgAssetId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "org_asset_id",
      },
      ConfidentialityScore: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "confidentiality_score",
      },
      IntegrityScore: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "integrity_score",
      },
      AvailabilityScore: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "availability_score",
      },
      OperationalImpact: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "operational_impact",
      },

      ...commonFields, // includes createdBy, modifiedBy, createdDate, modifiedDate, isDeleted, etc.
    },
    {
      tableName: "prot_det_mitre_control",
      schema: "public",
      timestamps: false,
    }
  );

  return ProtDetMitreControl;
};
