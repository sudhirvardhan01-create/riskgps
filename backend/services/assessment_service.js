const {
  Assessment,
  AssessmentProcess,
  AssessmentProcessRiskScenario,
  AssessmentRiskScenarioBusinessImpact,
  AssessmentRiskTaxonomy,
  Organization,
  OrganizationBusinessUnit,
  sequelize,
} = require("../models");
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
        throw new CustomError(
          "Assessment name is required",
          HttpStatus.BAD_REQUEST
        );
      }
      if (!assessmentData.assessmentDesc) {
        throw new CustomError(
          "Assessment description is required",
          HttpStatus.BAD_REQUEST
        );
      }
      if (!assessmentData.orgId) {
        throw new CustomError(
          "Organization ID is required",
          HttpStatus.BAD_REQUEST
        );
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
        status: assessmentData.status || "pending",
        startDate: new Date(),
        endDate: assessmentData.status === "closed" ? new Date() : null,
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
  static async addProcessesAndUpdateStatus(
    assessmentId,
    processes,
    status,
    userId
  ) {
    const transaction = await Assessment.sequelize.transaction();

    try {
      if (!assessmentId) {
        throw new CustomError(
          "Assessment ID is required",
          HttpStatus.BAD_REQUEST
        );
      }
      if (!processes || !Array.isArray(processes) || processes.length === 0) {
        throw new CustomError(
          "At least one process is required",
          HttpStatus.BAD_REQUEST
        );
      }
      if (!status) {
        throw new CustomError("Status is required", HttpStatus.BAD_REQUEST);
      }

      // Check assessment
      const assessment = await Assessment.findByPk(assessmentId, {
        transaction,
      });
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
      const { assessmentId, riskScenarios, status } = payload;

      if (!assessmentId) {
        throw new CustomError(
          "assessmentId is required",
          HttpStatus.BAD_REQUEST
        );
      }

      if (
        !riskScenarios ||
        !Array.isArray(riskScenarios) ||
        riskScenarios.length === 0
      ) {
        throw new CustomError(
          "At least one risk scenario must be provided",
          HttpStatus.BAD_REQUEST
        );
      }

      // Prepare scenarios
      const scenariosToInsert = riskScenarios.map((rs) => ({
        assessmentProcessRiskId: uuidv4(),
        assessmentProcessId: rs.assessmentProcessId,
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
      await AssessmentProcessRiskScenario.bulkCreate(scenariosToInsert, {
        transaction,
      });

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
      return {
        message:
          "Risk scenarios saved and assessment status updated successfully",
        riskScenarios: scenariosToInsert,
      };
    } catch (err) {
      await transaction.rollback();
      throw new CustomError(
        err.message ||
          "Failed to save risk scenarios and update assessment status",
        err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  ///**
  //  * Fetch assessments with nested details (paginated, searchable, sortable)
  //  */
  //static async getAllAssessmentsWithDetails({
  //    page = 1,
  //    limit = 10,
  //    sortBy = "createdDate",
  //    sortOrder = "DESC",
  //}) {
  //    try {
  //        const offset = (page - 1) * limit;

  //        //Sorting
  //        const order = [[sortBy, sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC"]];

  //        const { count, rows } = await Assessment.findAndCountAll({
  //            order,
  //            limit,
  //            offset,
  //            //include: [
  //            //    { model: Organization, as: "organization" },
  //            //    { model: OrganizationBusinessUnit, as: "businessUnit" },
  //            //    //{
  //            //    //    model: AssessmentProcess,
  //            //    //    as: "processes",
  //            //    //    include: [
  //            //    //        {
  //            //    //            model: AssessmentProcessRiskScenario,
  //            //    //            as: "processRiskScenarios",
  //            //    //            include: [
  //            //    //                { model: AssessmentRiskScenarioBusinessImpact, as: "businessImpacts" },
  //            //    //                { model: AssessmentRiskTaxonomy, as: "riskTaxonomies" },
  //            //    //            ],
  //            //    //        },
  //            //    //    ],
  //            //    //},
  //            //    //{ model: AssessmentRiskScenarioBusinessImpact, as: "businessImpacts" },
  //            //    //{ model: AssessmentRiskTaxonomy, as: "riskTaxonomies" },
  //            //],
  //        });

  //        return {
  //            total: count,
  //            page,
  //            limit,
  //            totalPages: Math.ceil(count / limit),
  //            data: rows,
  //        };
  //    } catch (err) {
  //        throw new CustomError(
  //            err.message || "Failed to fetch assessments with details",
  //            HttpStatus.INTERNAL_SERVER_ERROR
  //        );
  //    }
  //}

  /**
   * Get all assessments with pagination, search, and sorting
   */
  static async getAllAssessments(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const { count, rows } = await Assessment.findAndCountAll({
        limit,
        offset,
        include: [
          {
            model: AssessmentProcess,
            as: "processes",
            include: [
              {
                model: AssessmentProcessRiskScenario,
                as: "processRiskScenarios",
                include: [
                  {
                    model: AssessmentRiskScenarioBusinessImpact,
                    as: "riskScenarioBusinessImpacts",
                  },
                  { model: AssessmentRiskTaxonomy, as: "riskTaxonomies" },
                ],
              },
            ],
          },
        ],
      });

      return {
        total: count,
        page,
        limit,
        data: rows,
      };
    } catch (err) {
      throw new CustomError(
        err.message || "Failed to fetch assessments",
        err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get assessment by ID
   */
  static async getAssessmentById(assessmentId) {
    try {
      if (!assessmentId) {
        throw new CustomError(
          "Assessment ID is required",
          HttpStatus.BAD_REQUEST
        );
      }

      const assessment = await Assessment.findOne({
        where: { assessmentId },
      });

      if (!assessment) {
        throw new CustomError("Assessment not found", HttpStatus.NOT_FOUND);
      }

      return assessment;
    } catch (err) {
      throw new CustomError(
        err.message || "Failed to fetch assessment",
        err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Save business impacts & taxonomies for an assessment process risk
   * @param {Object} payload
   * @param {string} payload.assessmentId
   * @param {string} payload.assessmentProcessRiskId
   * @param {Array} payload.businessImpacts
   * @param {Array} payload.taxonomies
   * @param {string} userId
   */
  static async saveRiskDetails(payload, userId) {
    const transaction = await sequelize.transaction();
    try {
      const { assessmentId, riskScenarios } = payload;

      if (!assessmentId || !riskScenarios) {
        throw new CustomError(
          "assessmentId and riskScenarios are required",
          HttpStatus.BAD_REQUEST
        );
      }

      // Insert Business Impacts
      if (riskScenarios && riskScenarios.length > 0) {
        const biRecords = riskScenarios.map((bi) => ({
          assessmentRiskBIId: uuidv4(),
          assessmentId,
          assessmentProcessRiskId: bi.assessmentProcessRiskId,
          riskThreshold: bi.thresholdHours,
          riskThresholdValue: bi.thresholdCost,
          createdBy: userId,
          modifiedBy: userId,
          createdDate: new Date(),
          modifiedDate: new Date(),
          isDeleted: false,
        }));

        const taxonomyRecords = riskScenarios.flatMap((risk) =>
          risk.taxonomy?.map((tx) => ({
            assessmentRiskTaxonomyId: uuidv4(),
            assessmentId,
            assessmentProcessRiskId: risk.assessmentProcessRiskId,
            taxonomyName: tx.name,
            severityName: tx.severityDetails.name,
            severityMinRange: tx.severityDetails.minRange || null,
            severityMaxRange: tx.severityDetails.maxRange || null,
            severityColor: tx.severityDetails.color || null,
            createdBy: userId,
            modifiedBy: userId,
            createdDate: new Date(),
            modifiedDate: new Date(),
            isDeleted: false,
          }))
          );

          console.log("BI Records:", biRecords);
          console.log("Taxonomy Records:", taxonomyRecords);

        await AssessmentRiskScenarioBusinessImpact.bulkCreate(biRecords, {
          transaction,
        });

        await AssessmentRiskTaxonomy.bulkCreate(taxonomyRecords, {
          transaction,
        });
      }

      await transaction.commit();
      return {
        message: "Business impacts & taxonomies saved successfully",
      };
    } catch (err) {
      await transaction.rollback();
      throw new CustomError(
        err.message || "Failed to save business impacts & taxonomies",
        err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

module.exports = AssessmentService;
