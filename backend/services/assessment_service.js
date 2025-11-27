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
  User,
  OrganizationThreat,
  AssessmentThreat,
} = require("../models");
const CustomError = require("../utils/CustomError");
const HttpStatus = require("../constants/httpStatusCodes");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

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
        modifiedDate: new Date(),
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

      // Step 1: Verify parent assessment exists
      const assessment = await Assessment.findOne({
        where: { assessmentId, isDeleted: false },
      });

      if (!assessment) {
        throw new CustomError(
          "Assessment not found. Cannot create processes.",
          HttpStatus.NOT_FOUND
        );
      }

      // Step 2: Delete existing processes for this assessmentId
      await AssessmentProcess.destroy({
        where: { assessmentId },
      });

      // Step 3: Insert new processes
      const newProcessRecords = [];

      for (const proc of processes) {
        const newRecord = await AssessmentProcess.create({
          assessmentProcessId: uuidv4(),
          assessmentId: assessment.assessmentId,
          id: proc.id,
          processName: proc.processName,
          processDescription: proc.processDescription || null,
          order: proc.order,
          createdBy: userId,
          modifiedBy: userId,
          createdDate: new Date(),
          modifiedDate: new Date(),
        });

        newProcessRecords.push(newRecord);
      }

      // Step 4: Update assessment status/progress if needed
      if (status) {
        await assessment.update({
          status,
          progress: 20, // since new processes added
          modifiedBy: userId,
          modifiedDate: new Date(),
        });
      }

      // Step 5: Return updated list
      return {
        message: "Processes deleted, recreated and status updated successfully",
        processes: newProcessRecords,
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
   */
  static async addRiskScenariosAndUpdateStatus(payload, userId) {
    try {
      const { assessmentId, riskScenarios, status } = payload;

      if (!assessmentId) {
        throw new CustomError(
          "assessmentId is required",
          HttpStatus.BAD_REQUEST
        );
      }

      if (!Array.isArray(riskScenarios) || riskScenarios.length === 0) {
        throw new CustomError(
          "riskScenarios array is required",
          HttpStatus.BAD_REQUEST
        );
      }

      //Step 1: Delete all existing scenarios for assessmentId
      await AssessmentProcessRiskScenario.destroy({
        where: {
          assessmentId,
        },
      });

      //Step 2: Create new risk scenarios
      const newRiskRecords = [];

      for (const rs of riskScenarios) {
        const newEntry = await AssessmentProcessRiskScenario.create({
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

        newRiskRecords.push(newEntry);
      }

      //Step 3: Update assessment status
      if (status) {
        await Assessment.update(
          {
            status,
            progress: 40,
            modifiedBy: userId,
            modifiedDate: new Date(),
          },
          { where: { assessmentId } }
        );
      }

      //Step 4: Return final list
      const updatedList = await AssessmentProcessRiskScenario.findAll({
        where: { assessmentId },
      });

      return {
        message: "Risk Scenarios deleted and recreated successfully",
        riskScenarios: updatedList,
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
        where: { isDeleted: false },
        include: [
          {
            model: User,
            as: "users",
            attributes: ["userId", "name"],
            required: false,
          },
        ],
        limit,
        offset,
        order: [["modifiedDate", "DESC"]],
      });

      // Convert to plain JSON and clean up
      const formattedData = rows.map((a) => {
        const plain = a.toJSON();
        return {
          ...plain,
          createdByName: plain.users ? plain.users.name : null,
          users: undefined, // Remove users object
        };
      });

      return {
        total: count,
        page,
        limit,
        data: formattedData,
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
        where: {
          assessmentId,
          isDeleted: false,
        },
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
                as: "riskScenarios",
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
          {
            model: User,
            as: "users",
            attributes: ["userId", "name"],
            required: false,
          },
        ],
      });

      if (!assessment) {
        throw new CustomError("Assessment not found", HttpStatus.NOT_FOUND);
      }

      const plainAssessment = assessment.toJSON();

      const formattedAssessment = {
        ...plainAssessment,
        createdByName: plainAssessment.users
          ? plainAssessment.users.name
          : null,
        processes: (plainAssessment.processes || []).map((process) => ({
          ...process,
          riskScenarios: (process.riskScenarios || []).map((risk) => ({
            ...risk,
            taxonomy: (risk.taxonomy || []).map((t) => ({
              assessmentRiskTaxonomyId: t.assessmentRiskTaxonomyId,
              taxonomyId: t.taxonomyId,
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

      //delete formattedAssessment.createdByUser;
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
     * Option B: Delete + Recreate All Taxonomies
     *
     * @param {Object} payload
     * @param {string} payload.assessmentId
     * @param {Array} payload.riskScenarios
     * @param {string} payload.status
     * @param {string} userId
     */
    static async saveRiskDetails(payload, userId) {
        try {
            const { assessmentId, riskScenarios, status } = payload;

            if (!assessmentId) {
                throw new CustomError("assessmentId is required", HttpStatus.BAD_REQUEST);
            }

            if (!Array.isArray(riskScenarios) || riskScenarios.length === 0) {
                throw new CustomError(
                    "riskScenarios array is required",
                    HttpStatus.BAD_REQUEST
                );
            }

            // Step 1: Delete all previous taxonomies for this assessment
            await AssessmentRiskTaxonomy.destroy({
                where: { assessmentId },
            });

            // Step 2: Insert all NEW taxonomies from payload
            const newRecords = [];

            for (const rs of riskScenarios) {
                for (const tx of rs.taxonomy || []) {
                    const created = await AssessmentRiskTaxonomy.create({
                        assessmentRiskTaxonomyId: uuidv4(),
                        assessmentId: assessmentId,
                        assessmentProcessRiskId: rs.assessmentProcessRiskId,
                        taxonomyId: tx.taxonomyId,
                        taxonomyName: tx.name,
                        severityName: tx.severityDetails.name,
                        severityMinRange: tx.severityDetails.minRange,
                        severityMaxRange: tx.severityDetails.maxRange,
                        color: tx.severityDetails.color,
                        weightage: tx.weightage,
                        severityId: tx.severityDetails.severityId,
                        createdBy: userId,
                        modifiedBy: userId,
                        createdDate: new Date(),
                        modifiedDate: new Date()
                    });

                    newRecords.push(created);
                }
            }

            // Step 3: Update assessment status
            if (status) {
                await Assessment.update(
                    {
                        status,
                        progress: 60,
                        modifiedBy: userId,
                        modifiedDate: new Date()
                    },
                    { where: { assessmentId } }
                );
            }

            // Step 4: Return fresh list
            const finalList = await AssessmentRiskTaxonomy.findAll({
                where: { assessmentId },
            });

            return {
                message: "Risk taxonomies deleted and recreated successfully",
                taxonomies: finalList,
            };
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to save risk details",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


  /**
   * Save assets for an assessment process and update assessment status
   */
  static async addAssetsAndUpdateStatus(payload, userId) {
    try {
      const { assessmentId, assets, status } = payload;

      if (!assessmentId) {
        throw new CustomError(
          "assessmentId is required",
          HttpStatus.BAD_REQUEST
        );
      }

      if (!Array.isArray(assets) || assets.length === 0) {
        throw new CustomError(
          "assets array is required",
          HttpStatus.BAD_REQUEST
        );
      }

      // Step 1: DELETE ALL existing assets for this assessment
      await AssessmentProcessAsset.destroy({
        where: { assessmentId },
      });

      // Step 2: INSERT new Assets
      const newAssetRecords = [];

      for (const a of assets) {
        const created = await AssessmentProcessAsset.create({
          assessmentProcessAssetId: uuidv4(),
          assessmentProcessId: a.assessmentProcessId,
          assessmentId,
          id: a.id,
          applicationName: a.applicationName,
          assetCategory: a.assetCategory,
          createdBy: userId,
          modifiedBy: userId,
          createdDate: new Date(),
          modifiedDate: new Date(),
        });

        newAssetRecords.push(created);
      }

      // Step 3: Extract unique asset categories
      const uniqueCategories = [
        ...new Set(assets.map((a) => a.assetCategory.trim())),
      ];

      // Step 4: Get organizationId
      const assessment = await Assessment.findOne({
        where: { assessmentId, isDeleted: false },
        attributes: ["orgId"],
      });

      if (!assessment) {
        throw new CustomError(
          "Assessment not found for given assessmentId",
          HttpStatus.NOT_FOUND
        );
      }

      const orgId = assessment.orgId;

      // Step 5: Fetch threats mapped to these categories
      const threats = await OrganizationThreat.findAll({
        where: {
          organizationId: orgId,
          isDeleted: false,
          platforms: { [Op.overlap]: uniqueCategories },
        },
        raw: true,
      });

      // Step 6: DELETE ALL existing threats for this assessment
      await AssessmentThreat.destroy({
        where: { assessmentId },
      });

      // Step 7: INSERT new threats
      const newThreatEntries = [];

      for (const t of threats) {
        const newThreat = await AssessmentThreat.create({
          assessmentThreatId: uuidv4(),
          assessmentId,
          platforms: t.platforms,
          mitreTechniqueId: t.mitreTechniqueId,
          mitreTechniqueName: t.mitreTechniqueName,
          ciaMapping: t.ciaMapping,
          mitreControlId: t.mitreControlId,
          mitreControlName: t.mitreControlName,
          mitreControlDescription: t.mitreControlDescription,
          createdBy: userId,
          createdDate: new Date(),
          modifiedBy: userId,
          modifiedDate: new Date(),
          isDeleted: false,
        });

        newThreatEntries.push(newThreat);
      }

      // Step 8: Update assessment status
      if (status) {
        await Assessment.update(
          {
            status,
            progress: 80,
            modifiedBy: userId,
            modifiedDate: new Date(),
          },
          { where: { assessmentId } }
        );
      }

      // Step 9: Return latest assets
      const updatedAssets = await AssessmentProcessAsset.findAll({
        where: { assessmentId, isDeleted: false },
      });

      return {
        message: "Assets and threats deleted and recreated successfully",
        assets: updatedAssets,
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
    sortBy = "modifiedDate",
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
                as: "riskScenarios",
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
        order: [["modifiedDate", "DESC"]],
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
   * Create assessment questionnaire entries (Option B: Delete + Recreate)
   */
  static async createQuestionaires(
    assessmentId,
    questionaires,
    status,
    userId
  ) {
    try {
      if (!assessmentId) {
        throw new CustomError(
          "assessmentId is required",
          HttpStatus.BAD_REQUEST
        );
      }

      if (!Array.isArray(questionaires) || questionaires.length === 0) {
        throw new CustomError(
          "questionnaires array is required",
          HttpStatus.BAD_REQUEST
        );
      }

      // Step 1: Delete previous questionnaire records
      await AssessmentQuestionaire.destroy({
        where: { assessmentId },
      });

      // Step 2: Insert new questionnaire records
      const newRecords = [];

      for (const q of questionaires) {
        const newEntry = await AssessmentQuestionaire.create({
          assessmentQuestionaireId: uuidv4(),
          assessmentId: assessmentId,
          assessmentProcessAssetId: q.assessmentProcessAssetId,
          questionnaireId: q.questionnaireId,
          question: q.question,
          responseValue: q.responseValue || null,
          createdBy: userId,
          modifiedBy: userId,
          createdDate: new Date(),
          modifiedDate: new Date(),
        });

        newRecords.push(newEntry);
      }

      // Step 3: Update assessment status
      if (status) {
        await Assessment.update(
          {
            status,
            progress: 100,
            modifiedBy: userId,
            modifiedDate: new Date(),
          },
          { where: { assessmentId } }
        );
      }

      // Step 4: Return fresh list
      const finalList = await AssessmentQuestionaire.findAll({
        where: { assessmentId },
      });

      return {
        message: "Questionnaires deleted and recreated successfully",
        questionnaire: finalList,
      };
    } catch (err) {
      throw new CustomError(
        err.message || "Failed to save assessment questionnaire",
        err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Soft delete an assessment and all its related nested records
   * @param {string} assessmentId
   * @param {string} userId
   */
  static async softDeleteAssessment(assessmentId, userId) {
    const {
      Assessment,
      AssessmentProcess,
      AssessmentProcessAsset,
      AssessmentProcessRiskScenario,
      AssessmentRiskScenarioBusinessImpact,
      AssessmentRiskTaxonomy,
      AssessmentQuestionaire,
    } = require("../models");

    if (!assessmentId) {
      throw new CustomError(
        "Assessment ID is required",
        HttpStatus.BAD_REQUEST
      );
    }

    // Check if the assessment exists
    const assessment = await Assessment.findByPk(assessmentId);
    if (!assessment) {
      throw new CustomError("Assessment not found", HttpStatus.NOT_FOUND);
    }

    const updatePayload = {
      isDeleted: true,
      modifiedBy: userId,
      modifiedDate: new Date(),
    };

    try {
      // Soft delete questionaires
      await AssessmentQuestionaire.update(updatePayload, {
        where: { assessmentId },
      });

      // Soft delete risk-related entities
      await AssessmentRiskScenarioBusinessImpact.update(updatePayload, {
        where: { assessmentId },
      });
      await AssessmentRiskTaxonomy.update(updatePayload, {
        where: { assessmentId },
      });
      await AssessmentProcessRiskScenario.update(updatePayload, {
        where: { assessmentId },
      });

      // Soft delete assets and processes
      await AssessmentProcessAsset.update(updatePayload, {
        where: { assessmentId },
      });
      await AssessmentProcess.update(updatePayload, {
        where: { assessmentId },
      });

      // Finally, soft delete the main assessment
      await Assessment.update(updatePayload, {
        where: { assessmentId },
      });

      return {
        assessmentId,
        modifiedBy: userId,
        modifiedDate: updatePayload.modifiedDate,
      };
    } catch (err) {
      console.error("Soft delete failed:", err);
      throw new CustomError(
        err.message || "Failed to soft delete assessment and nested entities",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

module.exports = AssessmentService;
