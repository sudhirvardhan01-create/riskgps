const {
  Assessment,
  AssessmentProcess,
  AssessmentProcessRiskScenario,
  AssessmentRiskScenarioBusinessImpact,
  AssessmentRiskTaxonomy,
  Organization,
  OrganizationBusinessUnit,
  AssessmentProcessAsset,
  AssessmentQuestionaire,
} = require("../models");
const CustomError = require("../utils/CustomError");
const HttpStatus = require("../constants/httpStatusCodes");
const { v4: uuidv4 } = require("uuid");

class AssessmentService {
  /**
   * Generate next runId based on the last RunId in the database
   */
  static async generateRunId() {
    const lastAssessment = await Assessment.findOne({
      order: [["created_date", "DESC"]],
      attributes: ["runId"],
    });

    let newRunId = "1001";

    if (lastAssessment && lastAssessment.runId) {
      const lastRunId = parseInt(lastAssessment.runId, 10);
      newRunId = (lastRunId + 1).toString();
    }

    return newRunId;
  }

  /**
   * Create a new assessment
   * @param {Object} assessmentData - Assessment payload
   * @param {string} userId - Current user creating the assessment
   */
  static async createAssessment(assessmentData, userId) {
    try {
      // Validation
      if (!assessmentData.assessmentName) {
        throw new CustomError(
          "Assessment name is required",
          HttpStatus.BAD_REQUEST
        );
      }
      if (!assessmentData.orgId) {
        throw new CustomError(
          "Organization ID is required",
          HttpStatus.BAD_REQUEST
        );
      }

      let assessment;

      // CASE 1: Existing Assessment (Update)
      if (assessmentData.assessmentId) {
        assessment = await Assessment.findByPk(assessmentData.assessmentId);

        if (assessment) {
          await assessment.update({
            assessmentName: assessmentData.assessmentName,
            assessmentDesc: assessmentData.assessmentDesc,
            orgId: assessmentData.orgId,
            orgName: assessmentData.orgName || null,
            orgDesc: assessmentData.orgDesc || null,
            businessUnitId: assessmentData.businessUnitId || null,
            businessUnitName: assessmentData.businessUnitName || null,
            businessUnitDesc: assessmentData.businessUnitDesc || null,
            status: assessmentData.status || assessment.status,
            endDate:
              assessmentData.status === "closed"
                ? new Date()
                : assessment.endDate,
            lastActivity: new Date(),
            modifiedBy: userId,
            modifiedDate: new Date(),
          });

          return assessment;
        }
      }

      // CASE 2: New Assessment (Create)
      const newRunId = await this.generateRunId();

      assessment = await Assessment.create({
        assessmentId: uuidv4(),
        assessmentName: assessmentData.assessmentName,
        assessmentDesc: assessmentData.assessmentDesc || null,
        runId: newRunId,
        orgId: assessmentData.orgId,
        orgName: assessmentData.orgName || null,
        orgDesc: assessmentData.orgDesc || null,
        businessUnitId: assessmentData.businessUnitId || null,
        businessUnitName: assessmentData.businessUnitName || null,
        businessUnitDesc: assessmentData.businessUnitDesc || null,
        status: assessmentData.status || "pending",
        progress: 0,
        startDate: new Date(),
        createdBy: userId,
        createdDate: new Date(),
      });

      return assessment;
    } catch (err) {
      throw new CustomError(
        err.message || "Failed to save assessment",
        err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Add processes and update status
   */
  static async addProcessesAndUpdateStatus(
    assessmentId,
    processes,
    status,
    userId
  ) {
    try {
      if (!assessmentId) {
        throw new CustomError(
          "Assessment ID is required",
          HttpStatus.BAD_REQUEST
        );
      }

      const assessment = await Assessment.findByPk(assessmentId);
      if (!assessment) {
        throw new CustomError("Assessment not found", HttpStatus.NOT_FOUND);
      }

      let progress = undefined;

      for (const proc of processes) {
        let existingProcess = null;

        if (proc.assessmentProcessId) {
          // Check in DB first
          existingProcess = await AssessmentProcess.findOne({
            where: { assessmentProcessId: proc.assessmentProcessId },
          });
        }

        if (existingProcess) {
          // Update existing record
          await existingProcess.update({
            processName: proc.processName,
            processDescription: proc.processDescription || null,
            order: proc.order,
            modifiedBy: userId,
            modifiedDate: new Date(),
          });
        } else {
          // Insert new record
          await AssessmentProcess.create({
            assessmentProcessId: uuidv4(),
            assessmentId,
            id: proc.id,
            processName: proc.processName,
            processDescription: proc.processDescription || null,
            order: proc.order,
            createdBy: userId,
            modifiedBy: userId,
            createdDate: new Date(),
          });

          progress = 20;
        }
      }

      if (status) {
        assessment.status = status;
        assessment.progress = progress;
        assessment.modifiedBy = userId;
        assessment.modifiedDate = new Date();
        await assessment.save();
      }
      return {
        message: "Processes saved and status updated successfully",
        processes: await AssessmentProcess.findAll({
          where: {
            assessmentId: assessmentId,
          },
        }),
      };
    } catch (err) {
      throw new CustomError(
        err.message || "Failed to save processes",
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
    try {
      const { assessmentId, riskScenarios, status } = payload;
      if (!assessmentId)
        throw new CustomError(
          "assessmentId is required",
          HttpStatus.BAD_REQUEST
        );

      let progress = undefined;

      for (const rs of riskScenarios) {
        let existingRisk = null;

        if (rs.assessmentProcessRiskId) {
          existingRisk = await AssessmentProcessRiskScenario.findOne({
            where: { assessmentProcessRiskId: rs.assessmentProcessRiskId },
          });
        }

        if (existingRisk) {
          await existingRisk.update({
            riskScenario: rs.riskScenario,
            riskDescription: rs.riskDescription || null,
            modifiedBy: userId,
            modifiedDate: new Date(),
          });
        } else {
          await AssessmentProcessRiskScenario.create({
            assessmentProcessRiskId: uuidv4(),
            assessmentProcessId: rs.assessmentProcessId,
            assessmentId,
            id: rs.id,
            riskScenario: rs.riskScenario,
            riskDescription: rs.riskDescription || null,
            createdBy: userId,
            modifiedBy: userId,
            createdDate: new Date(),
            modifiedDate: new Date(),
          });

          progress = 40;
        }
      }

      if (status) {
        await Assessment.update(
          {
            status,
            progress: progress,
            modifiedBy: userId,
            modifiedDate: new Date(),
          },
          { where: { assessmentId } }
        );
      }
      return {
        message: "Risk Scenarios saved successfully",
        riskScenarios: await AssessmentProcessRiskScenario.findAll({
          where: {
            assessmentId: assessmentId,
          },
        }),
      };
    } catch (err) {
      throw new CustomError(
        err.message || "Failed to save risk scenarios",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get all assessments with pagination, search, and sorting
   */
  static async getAllAssessments(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const { count, rows } = await Assessment.findAndCountAll({
        limit,
        offset,
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
   * Get assessment by ID (new JSON structure)
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
        include: [
          {
            model: AssessmentProcess,
            as: "processes",
            required: false,
            include: [
              {
                model: AssessmentProcessAsset,
                as: "assets",
                required: false,
                include: [
                  {
                    model: AssessmentQuestionaire,
                    as: "questionnaire",
                    required: false,
                  },
                ],
              },
              {
                model: AssessmentProcessRiskScenario,
                as: "risks",
                required: false,
                include: [
                  {
                    model: AssessmentRiskTaxonomy,
                    as: "taxonomy",
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!assessment) {
        throw new CustomError("Assessment not found", HttpStatus.NOT_FOUND);
      }

      // 🔹 Convert to plain JSON immediately to remove Sequelize circular refs
      const plainAssessment = assessment.toJSON();

      // 🔹 Transform output
      const formattedAssessment = {
        ...plainAssessment,
        processes: (plainAssessment.processes || []).map((process) => ({
          ...process,
          risks: (process.risks || []).map((risk) => ({
            ...risk,
            taxonomy: (risk.taxonomy || []).map((t) => ({
              taxonomyId: t.assessmentRiskTaxonomyId,
              name: t.taxonomyName,
              orgId: plainAssessment.orgId,
              weightage: t.weightage,
              severityDetails: {
                name: t.severityName,
                minRange: t.severityMinRange,
                maxRange: t.severityMaxRange,
                color: t.color,
                severityId: t.severityId,
              },
            })),
          })),
        })),
      };

      return formattedAssessment;
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
    try {
      const { assessmentId, riskScenarios, status } = payload;
      let progress = undefined;

      for (const rs of riskScenarios) {
        // Business Impacts
        // for (const bi of rs.businessImpacts || []) {
        //   let existingBI = null;
        //   if (bi.assessmentRiskBIId) {
        //     existingBI = await AssessmentRiskScenarioBusinessImpact.findOne({
        //       where: { assessmentRiskBIId: bi.assessmentRiskBIId },
        //     });
        //   }

        //   if (existingBI) {
        //     await existingBI.update({
        //       modifiedBy: userId,
        //       modifiedDate: new Date(),
        //     });
        //   } else {
        //     await AssessmentRiskScenarioBusinessImpact.create({
        //       assessmentRiskBIId: uuidv4(),
        //       assessmentId,
        //       assessmentProcessRiskId: rs.assessmentProcessRiskId,
        //       createdBy: userId,
        //       modifiedBy: userId,
        //       createdDate: new Date(),
        //       modifiedDate: new Date(),
        //       isDeleted: false,
        //     });
        //   }
        // }

        // Taxonomies
        for (const tx of rs.taxonomy || []) {
          let existingTax = null;
          if (tx.assessmentRiskTaxonomyId) {
            existingTax = await AssessmentRiskTaxonomy.findOne({
              where: { assessmentRiskTaxonomyId: tx.assessmentRiskTaxonomyId },
            });
          }

          if (existingTax) {
            await existingTax.update({
              taxonomyName: tx.name,
              severityName: tx.severityDetails.name,
              severityMinRange: tx.severityDetails.minRange,
              severityMaxRange: tx.severityDetails.maxRange,
              color: tx.severityDetails.color,
              modifiedBy: userId,
              modifiedDate: new Date(),
            });
          } else {
            await AssessmentRiskTaxonomy.create({
              assessmentRiskTaxonomyId: uuidv4(),
              assessmentId,
              assessmentProcessRiskId: rs.assessmentProcessRiskId,
              taxonomyName: tx.name,
              severityName: tx.severityDetails.name,
              severityMinRange: tx.severityDetails.minRange,
              severityMaxRange: tx.severityDetails.maxRange,
              color: tx.severityDetails.color,
              severityId: tx.severityDetails.severityId,
              createdBy: userId,
              modifiedBy: userId,
              createdDate: new Date(),
            });

            progress = 60;
          }
        }
      }

      if (status) {
        await Assessment.update(
          {
            status,
            progress: progress,
            modifiedBy: userId,
            modifiedDate: new Date(),
          },
          { where: { assessmentId } }
        );
      }

      return { message: "Business Impacts and Taxonomies saved successfully" };
    } catch (err) {
      throw new CustomError(
        err.message || "Failed to save risk details",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Save assets for an assessment process and update assessment status
   * @param {Object} payload
   * @param {string} payload.assessmentId
   * @param {Array} payload.assets
   * @param {string} payload.status
   * @param {string} userId
   */
  static async addAssetsAndUpdateStatus(payload, userId) {
    try {
      const { assessmentId, assets, status } = payload;
      if (!assessmentId)
        throw new CustomError(
          "assessmentId is required",
          HttpStatus.BAD_REQUEST
        );

      let progress = undefined;

      for (const a of assets) {
        let existingAsset = null;

        if (a.assessmentProcessAssetId) {
          existingAsset = await AssessmentProcessAsset.findOne({
            where: { assessmentProcessAssetId: a.assessmentProcessAssetId },
          });
        }

        if (existingAsset) {
          await existingAsset.update({
            applicationName: a.applicationName,
            assetCategory: a.assetCategory,
            modifiedBy: userId,
            modifiedDate: new Date(),
          });
        } else {
          await AssessmentProcessAsset.create({
            assessmentProcessAssetId: uuidv4(),
            assessmentProcessId: a.assessmentProcessId,
            assessmentId,
            id: a.id,
            applicationName: a.applicationName,
            assetCategory: a.assetCategory,
            createdBy: userId,
            modifiedBy: userId,
            createdDate: new Date(),
          });

          progress = 80;
        }
      }

      if (status) {
        await Assessment.update(
          {
            status,
            progress: progress,
            modifiedBy: userId,
            modifiedDate: new Date(),
          },
          { where: { assessmentId } }
        );
      }

      return {
        message: "Assets saved successfully",
        assets: await AssessmentProcessAsset.findAll({
          where: {
            assessmentId: assessmentId,
          },
        }),
      };
    } catch (err) {
      throw new CustomError(
        err.message || "Failed to save assets",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Fetch all assessments with full nested details (organization, processes, assets, risks, impacts, taxonomies)
   */
  static async getAllAssessmentsWithDetails({
    page = 1,
    limit = 10,
    sortBy = "createdDate",
    sortOrder = "DESC",
  }) {
    try {
      const offset = (page - 1) * limit;
      const order = [
        [sortBy, sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC"],
      ];

      const { count, rows } = await Assessment.findAndCountAll({
        order,
        limit,
        offset,
        include: [
          {
            model: Organization,
            as: "organization",
          },
          {
            model: OrganizationBusinessUnit,
            as: "businessUnit",
          },
          {
            model: AssessmentProcess,
            as: "processes",
            include: [
              {
                model: AssessmentProcessAsset,
                as: "assets",
              },
              {
                model: AssessmentProcessRiskScenario,
                as: "risks",
                include: [
                  {
                    model: AssessmentRiskScenarioBusinessImpact,
                    as: "riskScenarioBusinessImpacts",
                  },
                  {
                    model: AssessmentRiskTaxonomy,
                    as: "taxonomy",
                  },
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
        totalPages: Math.ceil(count / limit),
        data: rows,
      };
    } catch (err) {
      throw new CustomError(
        err.message || "Failed to fetch assessments with details",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get assessments by organization ID or business unit ID (only assessment table)
   * @param {Object} params
   * @param {string} [params.orgId]
   * @param {string} [params.businessUnitId]
   */
  static async getAssessmentsByOrgOrBU({ orgId, businessUnitId }) {
    try {
      const whereClause = {};

      if (orgId) whereClause.orgId = orgId;
      if (businessUnitId) whereClause.businessUnitId = businessUnitId;

      const assessments = await Assessment.findAll({
        where: whereClause,
        order: [["createdDate", "DESC"]],
      });

      return assessments;
    } catch (err) {
      throw new CustomError(
        err.message ||
          "Failed to fetch assessments by organization or business unit",
        err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Create one or multiple assessment questionaire entries
   * @param {Array} questionaires
   * @param {string} userId
   */
  static async createQuestionaires(
    assessmentId,
    questionaires,
    status,
    userId
  ) {
    try {
      const recordsToInsert = questionaires.map((q) => ({
        assessmentQuestionaireId: uuidv4(),
        assessmentId: assessmentId,
        assessmentProcessAssetId: q.assessmentProcessAssetId,
        questionaireId: q.questionaireId,
        questionaireName: q.questionaireName,
        responseValue: q.responseValue || null,
        createdBy: userId,
        createdDate: new Date(),
        isDeleted: false,
      }));

      await AssessmentQuestionaire.bulkCreate(recordsToInsert);

      if (status) {
        await Assessment.update(
          {
            status: status,
            progress: 100,
            modifiedBy: userId,
            modifiedDate: new Date(),
          },
          { where: { assessmentId } }
        );
      }

      return recordsToInsert;
    } catch (err) {
      throw new CustomError(
        err.message || "Failed to create assessment questionaire",
        err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

module.exports = AssessmentService;
