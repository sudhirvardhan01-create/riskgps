const { DataTypes } = require('sequelize');
const { ASSETS } = require('../constants/library');

module.exports = (sequelize) => {
    const MitreThreatControl = sequelize.define('MitreThreatControl', {
        mitreThreatControlId: {
            allowNull: false,
            type: DataTypes.STRING,
            field: 'mitre_threat_control_id'
        },
        platforms: {
            type: DataTypes.ARRAY(
                DataTypes.ENUM(...ASSETS.ASSET_CATEGORY),
            ),
            field: 'platforms',
            allowNull: false,
        },
        mitreTechniqueId: {
            allowNull: false,
            type: DataTypes.STRING,
            field: 'mitre_technique_id'
        },
        mitreTechniqueName: {
            allowNull: false,
            type: DataTypes.STRING,
            field: 'mitre_technique_name'
        },
        ciaMapping: {
            allowNull: false,
            type: DataTypes.STRING,
            field: 'cia_mapping'
        },
        subTechniqueId: {
            type: DataTypes.STRING,
            field: 'sub_technique_id'
        },
        subTechniqueName: {
            type: DataTypes.STRING,
            field: 'sub_technique_name'
        },
        mitreControlId: {
            type: DataTypes.STRING,
            field: 'mitre_control_id'
        },
        mitreControlName: {
            type: DataTypes.STRING,
            field: 'mitre_control_name'
        },
        mitreControlType: {
            type: DataTypes.STRING,
            field: 'mitre_control_type'
        },
        mitreControlDescription: {
            type: DataTypes.TEXT,
            field: 'mitre_control_description'
        },
        bluOceanControlDescription: {
            type: DataTypes.TEXT,
            field: 'blu_ocean_control_description'
        }
    }, {
        tableName: 'library_mitre_threats_controls', 
        timestamps: false, 
        createdAt: "created_at",
        updatedAt: "updated_at",          
        underscored: true          
    });

    return MitreThreatControl;
}

