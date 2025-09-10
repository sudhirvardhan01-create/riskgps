const { Organization, Sequelize } = require("../models");
const { Op } = Sequelize;
const CustomError = require("../utils/CustomError");
const HttpStatus = require("../constants/httpStatusCodes");

class OrganizationService {
    /**
     * Get all organizations with pagination, search & sorting
     */
    static async getAllOrganizations(page, limit, searchPattern, sortBy, sortOrder) {
        try {
            const offset = page * limit;

            const whereClause = {};
            if (searchPattern) {
                whereClause.name = { [Op.iLike]: `%${searchPattern}%` };
            }

            const { rows, count } = await Organization.findAndCountAll({
                where: whereClause,
                offset,
                limit,
                order: [[sortBy, sortOrder]],
            });

            return {
                total: count,
                page,
                limit,
                organizations: rows,
            };
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to fetch organizations",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
 * Get organization by ID with business units
 */
    static async getOrganizationById(id) {
        try {
            const organization = await Organization.findByPk(id, {
                include: [
                    {
                        model: BusinessUnit,
                        as: "business_units",
                        where: { is_deleted: false },
                        required: false, // allow org without business units
                        attributes: [
                            "org_business_unit_id",
                            "business_unit_name",
                            "created_by",
                            "modified_by",
                            "created_date",
                            "modified_date",
                        ],
                    },
                ],
            });

            if (!organization) {
                throw new CustomError("Organization not found", HttpStatus.NOT_FOUND);
            }

            return organization;
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to fetch organization",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

}

module.exports = OrganizationService;
