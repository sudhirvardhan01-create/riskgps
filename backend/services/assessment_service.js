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
    OrganizationThreat
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
            modifiedDate: new Date()
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
        modifiedDate: new Date()
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

            //Step 1: Verify parent assessment exists
            const assessment = await Assessment.findOne({
                where: { assessmentId, isDeleted: false },
            });

            if (!assessment) {
                throw new CustomError(
                    "Assessment not found. Cannot create processes.",
                    HttpStatus.NOT_FOUND
                );
            }

            let progress;

            //Step 2: Loop processes and ensure FK correctness
            for (const proc of processes) {
                let existingProcess = null;

                if (proc.assessmentProcessId) {
                    existingProcess = await AssessmentProcess.findOne({
                        where: { assessmentProcessId: proc.assessmentProcessId },
                    });
                }

                if (existingProcess) {
                    await existingProcess.update({
                        processName: proc.processName,
                        processDescription: proc.processDescription || null,
                        order: proc.order,
                        modifiedBy: userId,
                        modifiedDate: new Date(),
                    });
                } else {
                    //Step 3: Create only if parent exists
                    await AssessmentProcess.create({
                        assessmentProcessId: uuidv4(),
                        assessmentId: assessment.assessmentId, // ✅ ensure correct parent FK
                        processName: proc.processName,
                        processDescription: proc.processDescription || null,
                        order: proc.order,
                        createdBy: userId,
                        modifiedBy: userId,
                        createdDate: new Date(),
                        modifiedDate: new Date(),
                    });

                    progress = 20;
                }
            }

            //Step 4: Update assessment status/progress if needed
            if (status) {
                await assessment.update({
                    status,
                    progress: progress || assessment.progress,
                    modifiedBy: userId,
                    modifiedDate: new Date(),
                });
            }

            //Step 5: Return updated process list
            const updatedProcesses = await AssessmentProcess.findAll({
                where: { assessmentId },
            });

            return {
                message: "Processes saved and status updated successfully",
                processes: updatedProcesses,
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
                where: { isDeleted: false },
                //include: [
                //    {
                //        model: User,
                //        as: "users",
                //        attributes: ["userId", "name"],
                //        required: false,
                //    },
                //],
                limit,
                offset,
                order: [["modifiedDate", "DESC"]],
            });

            // Convert to plain JSON and clean up
            const formattedData = rows.map((a) => {
                const plain = a.toJSON();
                return {
                    ...plain,
                    //createdByName: plain.createdByUser ? plain.createdByUser.name : null
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
                    //{
                    //    model: User,
                    //    as: "users",
                    //    attributes: ["userId", "name"],
                    //    required: false,
                    //},
                ],
            });

            if (!assessment) {
                throw new CustomError("Assessment not found", HttpStatus.NOT_FOUND);
            }

            const plainAssessment = assessment.toJSON();

            const formattedAssessment = {
                ...plainAssessment,
                //createdByName: plainAssessment.users
                //    ? plainAssessment.users.name
                //    : null,
                processes: (plainAssessment.processes || []).map((process) => ({
                    ...process,
                    risks: (process.risks || []).map((risk) => ({
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
              taxonomyId: tx.taxonomyId,
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

      return {
        message: "Business Impacts and Taxonomies saved successfully",
        taxonomies: await AssessmentRiskTaxonomy.findAll({
          where: {
            assessmentId: assessmentId,
          },
        }),
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
              where: {
                  assessmentProcessAssetId: a.assessmentProcessAssetId,
                  isDeleted: false
              },
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

        // Step 2️ - Extract unique asset categories from payload
        const uniqueCategories = [
            ...new Set(assets.map((a) => a.assetCategory)),
        ];

        // Step 3️ - Fetch OrganizationThreats where any platform matches these categories
        // To get orgId, we'll need to derive it from assessment or its linked organization
        const assessment = await Assessment.findOne({
            where: { assessmentId, isDeleted: false },
            attributes: ["organizationId"],
        });

        const orgId = assessment.organizationId;
        const threats = await OrganizationThreat.findAll({
            where: {
                organizationId: orgId,
                platforms: {
                    [Op.overlap]: uniqueCategories, // ARRAY overlap operator in Postgres
                },
                isDeleted: false,
            },
        });

        console.log("Number of threats found:", threats.length);

        // Step 4️ - Prepare AssessmentThreat entries
        const threatRecords = threats.map((t) => ({
            assessmentThreatId: uuidv4(),
            assessmentId: assessmentId,
            platforms: t.platforms,
            mitreTechniqueId: t.mitreTechniqueId,
            mitreTechniqueName: t.mitreTechniqueName,
            ciaMapping: t.ciaMapping,
            mitreControlId: t.mitreControlId,
            mitreControlName: t.mitreControlName,
            mitreControlDescription: t.mitreControlDescription,
            createdBy: userId,
            createdDate: new Date(),
            isDeleted: false,
        }));

        // Step 5️ - Insert new AssessmentThreats
        if (threatRecords.length > 0) {
            await AssessmentThreat.bulkCreate(threatRecords);
        }

        // Step 6️ - Update Assessment status if provided
        if (status) {
            await Assessment.update(
                {
                    status,
                    progress,
                    modifiedBy: userId,
                    modifiedDate: new Date()
                },
                { where: { assessmentId } }
            );
        }

        // Step 7️ - Return updated data
        const updatedAssets = await AssessmentProcessAsset.findAll({
            where: { assessmentId, isDeleted: false },
        });

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
         * Create or update assessment questionnaire entries
         * @param {string} assessmentId
         * @param {Array} questionaires
         * @param {string} status
         * @param {string} userId
         */
    static async createQuestionaires(assessmentId, questionaires, status, userId) {
        try {
            for (const q of questionaires) {
                const existingRecord = await AssessmentQuestionaire.findOne({
                    where: {
                        assessmentId: assessmentId,
                        assessmentProcessAssetId: q.assessmentProcessAssetId,
                        questionnaireId: q.questionnaireId,
                        isDeleted: false
                    },
                });

                if (existingRecord) {
                    // Update existing record
                    await existingRecord.update({
                        question: q.question,
                        responseValue: q.responseValue || null,
                        modifiedBy: userId,
                        modifiedDate: new Date()
                    });
                } else {
                    // Create new record
                    await AssessmentQuestionaire.create({
                        assessmentQuestionaireId: uuidv4(),
                        assessmentId: assessmentId,
                        assessmentProcessAssetId: q.assessmentProcessAssetId,
                        questionnaireId: q.questionnaireId,
                        question: q.question,
                        responseValue: q.responseValue || null,
                        createdBy: userId,
                        createdDate: new Date()
                    });
                }
            }

            // Optionally update assessment status
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

            return { success: true, message: "Questionnaires upserted successfully" };
        } catch (err) {
            throw new CustomError(
                err.message || "Failed to create or update assessment questionnaire",
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
            throw new CustomError("Assessment ID is required", HttpStatus.BAD_REQUEST);
        }

        // Check if the assessment exists
        const assessment = await Assessment.findByPk(assessmentId);
        if (!assessment) {
            throw new CustomError("Assessment not found", HttpStatus.NOT_FOUND);
        }

        const updatePayload = {
            isDeleted: true,
            modifiedBy: userId,
            modifiedDate: new Date()
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
