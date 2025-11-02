const commonFields = require("../common_fields");

module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define(
    "Organization",
    {
      organizationId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: "org_id",
      },
      orgCode: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "org_code",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "name",
      },
      desc: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "desc",
      },
      tags: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: "tags",
      },
      industryVertical: { type: DataTypes.STRING, field: "industry_vertical" },
      regionOfOperation: {
        type: DataTypes.STRING,
        field: "region_of_operation",
      },
      numberOfEmployees: {
        type: DataTypes.INTEGER,
        field: "number_of_employees",
      },
      cisoName: { type: DataTypes.STRING, field: "ciso_name" },
      cisoEmail: { type: DataTypes.STRING, field: "ciso_email" },
      annualRevenue: { type: DataTypes.BIGINT, field: "annual_revenue" },
      riskAppetite: { type: DataTypes.BIGINT, field: "risk_appetite" },
      cybersecurityBudget: {
        type: DataTypes.BIGINT,
        field: "cybersecurity_budget",
      },
      insuranceCoverage: {
        type: DataTypes.BIGINT,
        field: "insurance_coverage",
      },
      insuranceCarrier: { type: DataTypes.STRING, field: "insurance_carrier" },
      numberOfClaims: { type: DataTypes.INTEGER, field: "number_of_claims" },
      claimsValue: { type: DataTypes.BIGINT, field: "claims_value" },
      regulators: { type: DataTypes.STRING, field: "regulators" },
      regulatoryRequirements: {
        type: DataTypes.STRING,
        field: "regulatory_requirements",
      },
      additionalInformation: {
        type: DataTypes.TEXT,
        field: "additional_information",
      },
      recordTypes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        field: "record_types",
      },
      piiRecordsCount: { type: DataTypes.INTEGER, field: "pii_records_count" },
      pfiRecordsCount: { type: DataTypes.INTEGER, field: "pfi_records_count" },
      phiRecordsCount: { type: DataTypes.INTEGER, field: "phi_records_count" },
      governmentRecordsCount: {
        type: DataTypes.INTEGER,
        field: "government_records_count",
      },
      certifications: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        field: "certifications",
      },
      intellectualPropertyPercentage: {
        type: DataTypes.INTEGER,
        field: "intellectual_property_percentage",
      },

      ...commonFields, // adds createdBy, modifiedBy, createdDate, modifiedDate, isDeleted
    },
    {
      tableName: "organization",
      timestamps: false,
    }
  );

  Organization.associate = (models) => {
    // One organization has many assessments
    Organization.hasMany(models.Assessment, {
      foreignKey: "organizationId", // keep alias
      sourceKey: "organizationId",
      as: "assessments",
    });

    /**
     * Organization → Business Units
     */
    Organization.hasMany(models.OrganizationBusinessUnit, {
      foreignKey: "organizationId",
      sourceKey: "organizationId",
      as: "businessUnits",
    });

    /**
     * Organization → Assets
     */
    Organization.hasMany(models.OrganizationAsset, {
      foreignKey: "organizationId",
      sourceKey: "organizationId",
      as: "assets",
    });

    /**
     * Organization → Risk Scenarios
     */
    Organization.hasMany(models.OrganizationRiskScenario, {
      foreignKey: "organizationId",
      sourceKey: "organizationId",
      as: "riskScenarios",
    });

    /**
     * Organization → Taxonomies
     */
    Organization.hasMany(models.Taxonomy, {
      foreignKey: "organizationId",
      sourceKey: "organizationId",
      as: "taxonomies",
    });

    /**
     * Organization -> Users
     */
    Organization.hasMany(models.User, {
      foreignKey: "organizationId",
      sourceKey: "organizationId",
      as: "orgUsers",
    });
  };

  return Organization;
};
