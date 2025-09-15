const Assessment  = require("../models/assessment/assessment");
const CustomError = require("../utils/CustomError");
const HttpStatus = require("../constants/httpStatusCodes");
const { v4: uuidv4 } = require("uuid");

class AssessmentService {
    /**
     * Create a new assessment
     * @param {Object} assessmentData - Assessment payload
     * @param {string} userId - Current user creating the assessment
     */
    static async createAssessment(assessmentData, userId) {
        try {
            // Basic validation
            if (!assessmentData.assessmentName) {
                throw new CustomError("Assessment name is required", HttpStatus.BAD_REQUEST);
            }
            if (!assessmentData.assessmentDesc) {
                throw new CustomError("Assessment description is required", HttpStatus.BAD_REQUEST);
            }
            if (!assessmentData.orgId) {
                throw new CustomError("Organization ID is required", HttpStatus.BAD_REQUEST);
            }
            if (!assessmentData.runId) {
                throw new CustomError("Run ID is required", HttpStatus.BAD_REQUEST);
            }

            // Prepare payload
            const newAssessment = {
                assessmentId: uuidv4(),
                assessmentName: assessmentData.assessmentName,
                assessmentDesc: assessmentData.assessmentDesc,
                runId: assessmentData.runId,
                orgId: assessmentData.orgId,
                orgName: assessmentData.orgName || null,
                orgDesc: assessmentData.orgDesc || null,
                businessUnitId: assessmentData.businessUnitId || null,
                businessUnitName: assessmentData.businessUnitName || null,
                businessUnitDesc: assessmentData.businessUnitDesc || null,
                status: assessmentData.status || "Pending",
                startDate: assessmentData.startDate || null,
                endDate: assessmentData.endDate || null,
                lastActivity: assessmentData.lastActivity || null,
                userId: assessmentData.userId || null,
                createdBy: userId,
                modifiedBy: userId,
                createdDate: new Date(),
                modifiedDate: new Date(),
                isDeleted: false,
            };

            // Save to DB
            const assessment = await Assessment.create(newAssessment);
            return assessment;
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to create assessment",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Add processes and update status in one transaction
     */
    static async addProcessesAndUpdateStatus(assessmentId, processes, status, userId) {
        const transaction = await Assessment.sequelize.transaction();

        try {
            if (!assessmentId) {
                throw new CustomError("Assessment ID is required", HttpStatus.BAD_REQUEST);
            }
            if (!processes || !Array.isArray(processes) || processes.length === 0) {
                throw new CustomError("At least one process is required", HttpStatus.BAD_REQUEST);
            }
            if (!status) {
                throw new CustomError("Status is required", HttpStatus.BAD_REQUEST);
            }

            // Check assessment
            const assessment = await Assessment.findByPk(assessmentId, { transaction });
            if (!assessment) {
                throw new CustomError("Assessment not found", HttpStatus.NOT_FOUND);
            }

            // Prepare and insert processes
            const processRecords = processes.map((proc, index) => ({
                assessmentProcessId: uuidv4(),
                assessmentId,
                processName: proc.processName,
                processDescription: proc.processDescription || null,
                order: proc.order || index + 1,
                createdBy: userId,
                modifiedBy: userId,
                createdDate: new Date(),
                modifiedDate: new Date(),
                isDeleted: false,
            }));
            await AssessmentProcess.bulkCreate(processRecords, { transaction });

            // Update assessment status
            assessment.status = status;
            assessment.lastActivity = new Date();
            assessment.modifiedBy = userId;
            assessment.modifiedDate = new Date();
            await assessment.save({ transaction });

            await transaction.commit();

            return {
                message: "Processes added and status updated successfully",
                assessment,
                processes: processRecords,
            };
        } catch (err) {
            await transaction.rollback();
            throw new CustomError(
                err.message || "Failed to add processes and update status",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


    /**
     * Save risk scenarios for an assessment process and update assessment status
     * @param {Object} payload
     * @param {string} payload.assessmentId
     * @param {string} payload.assessmentProcessId
     * @param {Array} payload.riskScenarios
     * @param {string} payload.status
     * @param {string} userId
     */
    static async addRiskScenariosAndUpdateStatus(payload, userId) {
        const transaction = await sequelize.transaction();
        try {
            const { assessmentId, assessmentProcessId, riskScenarios, status } = payload;

            if (!assessmentId || !assessmentProcessId) {
                throw new CustomError(
                    "assessmentId and assessmentProcessId are required",
                    HttpStatus.BAD_REQUEST
                );
            }

            if (!riskScenarios || !Array.isArray(riskScenarios) || riskScenarios.length === 0) {
                throw new CustomError(
                    "At least one risk scenario must be provided",
                    HttpStatus.BAD_REQUEST
                );
            }

            // Prepare scenarios
            const scenariosToInsert = riskScenarios.map((rs) => ({
                assessmentProcessRiskId: uuidv4(),
                assessmentProcessId,
                assessmentId,
                riskScenarioName: rs.riskScenarioName,
                riskScenarioDesc: rs.riskScenarioDesc || null,
                createdBy: userId,
                modifiedBy: userId,
                createdDate: new Date(),
                modifiedDate: new Date(),
                isDeleted: false,
            }));

            // Insert scenarios
            await AssessmentProcessRiskScenario.bulkCreate(scenariosToInsert, { transaction });

            // Update assessment status
            if (status) {
                await Assessment.update(
                    {
                        status,
                        modifiedBy: userId,
                        modifiedDate: new Date(),
                    },
                    { where: { assessmentId }, transaction }
                );
            }

            await transaction.commit();
            return { message: "Risk scenarios saved and assessment status updated successfully" };
        } catch (err) {
            await transaction.rollback();
            throw new CustomError(
                err.message || "Failed to save risk scenarios and update assessment status",
                err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}

module.exports = AssessmentService;
