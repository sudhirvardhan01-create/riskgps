const { DataTypes } = require('sequelize');
const { GENERAL } = require('../constants/library');

module.exports = (sequelize) => {
    const FrameWorkControl = sequelize.define('FrameWorkControl', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        frameWorkName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'framework_name',
            validate: {
                notEmpty: true
            }
        },
        frameWorkControlCategoryId: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'framework_control_category_id',
            validate: {
                notEmpty: true
            }
        },
        frameWorkControlCategory: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'framework_control_category',
            validate: {
                notEmpty: true
            }
        },
        frameWorkControlDescription: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'framework_control_description',
        },
        frameWorkControlSubCategoryId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'framework_control_sub_category_id',
        },
        frameWorkControlSubCategory: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'framework_control_sub_category',
        },
        status: {
            defaultValue: 'published',
            allowNull: false,
            type: DataTypes.ENUM(...GENERAL.STATUS_SUPPORTED_VALUES)
        },
    }, {
        tableName: 'library_framework_controls',
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        underscored: true,
    });

    // Associations
    FrameWorkControl.associate = (models) => {
        FrameWorkControl.belongsToMany(models.MitreThreatControl, {
            through: models.MitreFrameworkControlMappings,
            foreignKey: 'framework_control_id',   // mapping table column
            otherKey: 'mitre_control_id',         // mapping table column
            targetKey: 'id',          // business key in MitreThreatControl
            as: 'mitre_controls',
        });
    };

    return FrameWorkControl;
}


