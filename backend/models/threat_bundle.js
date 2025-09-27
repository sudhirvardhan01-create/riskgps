const { commonFields } = require("./common_fields");
const { DataTypes } = require('sequelize');
const { GENERAL } = require('../constants/library');

module.exports = (sequelize) => {
    const ThreatBundle = sequelize.define(
        "ThreatBundle",
        {
            threatBundleId: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                field: "threat_bundle_id",
            },
            threatBundleName: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'threat_bundle_name',
                validate: {
                    notEmpty: true
                }
            },
            mitreTechniqueId: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'mitre_technique_id',
                validate: {
                    notEmpty: true
                }
            },
            mitreTechniqueName: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'mitre_technique_name',
                validate: {
                    notEmpty: true
                }
            },
            status: {
                type: DataTypes.ENUM(...GENERAL.STATUS_SUPPORTED_VALUES),
                allowNull: false,
                defaultValue: 'published'
            },
            ...commonFields
        },
        {
            tableName: "library_threat_bundle",
            schema: "public",
            timestamps: false,
        }
    );

    return ThreatBundle;
}