const {
    Assessment,
    AssessmentRiskTaxanomy,
    AssessmentRiskScenario,
    AssessmentRiskScenarioBusinessImpact,
    sequelize,
    Sequelize,
} = require("../models");

const { Op } = require("sequelize");
const CustomError = require("../utils/CustomError");
const HttpStatus = require("../constants/httpStatusCodes");
const Messages = require("../constants/messages");
const { GENERAL } = require("../constants/library");

class AssessmentService {
    /**
     * Create new Assessment
     */
    static async createAssessment(data) {
        return await sequelize.transaction(async (t) => {
            console.log("[createAssessment] Incoming data:", data);

            this.validateAssessmentData(data);

            const assessment = await Assessment.create(
                this.handleAssessmentDataColumnMapping(data),
                { transaction: t }
            );

            // Handle related risk taxonomies
            if (data.riskTaxonomies?.length > 0) {
                for (const taxonomyId of data.riskTaxonomies) {
                    await AssessmentRiskTaxanomy.create(
                        {
                            assessmentId: assessment.id,
                            taxonomyId,
                        },
                        { transaction: t }
                    );
                }
            }

            return assessment;
        });
    }

    /**
     * Get paginated assessments
     */
    static async getAllAssessments(
        page = 0,
        limit = 10,
        searchPattern = null,
        sortBy = "created_date",
        sortOrder = "ASC",
        statusFilter = []
    ) {
        const offset = page * limit;

        if (!GENERAL.ALLOWED_SORT_ORDER.includes(sortOrder)) {
            sortOrder = "ASC";
        }

        const whereClause = this.handleAssessmentFilters(
            searchPattern,
            statusFilter
        );

        const total = await Assessment.count({ where: whereClause });
        const data = await Assessment.findAll({
            limit,
            offset,
            order: [[sortBy, sortOrder]],
            where: whereClause,
            include: [
                { model: AssessmentRiskTaxanomy, as: "riskTaxonomies" },
                { model: AssessmentRiskScenario, as: "riskScenarios" },
            ],
        });

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Get Assessment by ID
     */
    static async getAssessmentById(id) {
        const assessment = await Assessment.findByPk(id, {
            include: [
                { model: AssessmentRiskTaxanomy, as: "riskTaxonomies" },
                {
                    model: AssessmentRiskScenario,
                    as: "riskScenarios",
                    include: [
                        {
                            model: AssessmentRiskScenarioBusinessImpact,
                            as: "businessImpacts",
                        },
                    ],
                },
            ],
        });

        if (!assessment) {
            throw new CustomError(
                Messages.ASSESSMENT.NOT_FOUND(id),
                HttpStatus.NOT_FOUND
            );
        }

        return assessment;
    }

    /**
     * Update Assessment
     */
    static async updateAssessment(id, data) {
        return await sequelize.transaction(async (t) => {
            const assessment = await Assessment.findByPk(id, { transaction: t });

            if (!assessment) {
                throw new CustomError(
                    Messages.ASSESSMENT.NOT_FOUND(id),
                    HttpStatus.NOT_FOUND
                );
            }

            this.validateAssessmentData(data);

            const updatedAssessment = await assessment.update(
                this.handleAssessmentDataColumnMapping(data),
                { transaction: t }
            );

            // Reset and re-map taxonomies
            await AssessmentRiskTaxanomy.destroy({
                where: { assessmentId: id },
                transaction: t,
            });

            if (data.riskTaxonomies?.length > 0) {
                for (const taxonomyId of data.riskTaxonomies) {
                    await AssessmentRiskTaxanomy.create(
                        {
                            assessmentId: id,
                            taxonomyId,
                        },
                        { transaction: t }
                    );
                }
            }

            return updatedAssessment;
        });
    }

    /**
     * Delete Assessment
     */
    static async deleteAssessmentById(id) {
        const assessment = await Assessment.findByPk(id);

        if (!assessment) {
            throw new CustomError(
                Messages.ASSESSMENT.NOT_FOUND(id),
                HttpStatus.NOT_FOUND
            );
        }

        await assessment.destroy();
        return { message: Messages.ASSESSMENT.DELETED };
    }

    /**
     * Validate Assessment Data
     */
    static validateAssessmentData(data) {
        const { name, status } = data;

        if (!name) {
            throw new CustomError(
                Messages.ASSESSMENT.NAME_REQUIRED,
                HttpStatus.BAD_REQUEST
            );
        }

        if (!status || !GENERAL.STATUS_SUPPORTED_VALUES.includes(status)) {
            throw new CustomError(
                Messages.LIBARY.INVALID_STATUS_VALUE,
                HttpStatus.BAD_REQUEST
            );
        }
    }

    /**
     * Map data into DB columns
     */
    static handleAssessmentDataColumnMapping(data) {
        const fields = ["name", "description", "status", "organizationId"];
        return Object.fromEntries(
            fields.map((key) => [key, data[key] === "" ? null : data[key]])
        );
    }

    /**
     * Handle search and filters
     */
    static handleAssessmentFilters(searchPattern, statusFilter) {
        const conditions = [];

        if (searchPattern) {
            conditions.push({
                [Op.or]: [
                    { name: { [Op.iLike]: `%${searchPattern}%` } },
                    { description: { [Op.iLike]: `%${searchPattern}%` } },
                ],
            });
        }

        if (statusFilter?.length > 0) {
            conditions.push({ status: { [Op.in]: statusFilter } });
        }

        return conditions.length > 0 ? { [Op.and]: conditions } : {};
    }
}

module.exports = AssessmentService;
