const { DataTypes } = require("sequelize");

const commonFields = {
    createdBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "created_by",
    },
    modifiedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "modified_by",
    },
    createdDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "created_date",
    },
    modifiedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "modified_date",
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_deleted",
    },
};

module.exports = { commonFields };