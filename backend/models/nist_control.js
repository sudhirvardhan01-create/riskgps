const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const NistControl = sequelize.define('NistControl', {
        nistGuid: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'nist_guid',
            validate: {
                notEmpty: true
            }
        },
        nistControlCategoryId: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'nist_control_category_id',
            validate: {
                notEmpty: true
            }
        },
        nistControlCategory: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'nist_control_category',
            validate: {
                notEmpty: true
            }
        },
        nistControlSubCategoryId: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'nist_control_sub_category_id',
            validate: {
                notEmpty: true
            }
        },
        nistControlSubCategory: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'nist_control_sub_category',
            validate: {
                notEmpty: true
            }
        },
        mitreControlId: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'mitre_control_id',
            validate: {
                notEmpty: true
            }
        },
        mitreControlName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'mitre_control_name',
            validate: {
                notEmpty: true
            }
        }
    }, {
        tableName: 'library_nist_controls',
        timestamps: false,
        underscored: true
    });

    return NistControl;
}


