const { sequelize, LibraryQuestionnaire } = require("../models");
const CustomError = require("../utils/CustomError");
const HttpStatus = require("../constants/httpStatusCodes");
const Messages = require("../constants/messages");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const { format } = require("@fast-csv/format");
const QueryStream = require("pg-query-stream");
const { QUESTIONNAIRE, GENERAL } = require("../constants/library");

class QuestionnaireService {
  static async createQuestionnaire(data) {
    this.validateQuestionnaireData(data);
    const newQuestion = {
      questionnaireId: uuidv4(),
      question: data.question,
      assetCategory: data.assetCategory,
      mitreControlId: data.mitreControlId,
      createdDate: new Date(),
      modifiedDate: new Date(),
      status: data.status,
      isDeleted: false,
    };
    const question = await LibraryQuestionnaire.create(newQuestion);
    return question;
  }

  static async getAllQuestionnaire(
    assetCategory = "Windows",
    page = 0,
    limit = 6,
    searchPattern = null,
    sortBy = "createdDate",
    sortOrder = "ASC"
  ) {
    const offset = page * limit;
    if (!QUESTIONNAIRE.ALLOWED_SORT_FIELD.includes(sortBy)) {
      sortBy = "createdDate";
    }
    if (!GENERAL.ALLOWED_SORT_ORDER.includes(sortOrder)) {
      sortOrder = "ASC";
    }
    const data = await LibraryQuestionnaire.findAll({
      ...(limit > 0 ? { limit, offset } : {}),
      where: {
        assetCategory: {
          [Op.contains]: [assetCategory], // Checks if array contains the category
        },
      },
      order: [[sortBy, sortOrder]],
    });
    const total = await LibraryQuestionnaire.count({
      where: {
        assetCategory: {
          [Op.contains]: [assetCategory], // Checks if array contains the category
        },
      },
    });
    const result = data.map((item) => ({
      questionnaireId: item.questionnaireId,
      questionCode: item.questionCode,
      question: item.question,
      assetCategory: assetCategory,
      mitreControlId: item.mitreControlId,
      status: item.status,
      createdBy: item.createdBy,
      modifiedBy: item.modifiedBy,
      createdDate: item.createdDate,
      modifiedDate: item.modifiedDate,
    }));
    return {
      data: result,
      total,
      page,
      limit,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 0,
    };
  }

  static async deleteQuestionnaire(id, assetCategory) {
    if (!id) {
      throw new CustomError(
        `${MESSAGES.GENERAL.REQUIRED_FIELD_MISSING}: id`,
        HttpStatus.BAD_REQUEST
      );
    }
    if (!assetCategory) {
      throw new CustomError(
        `${MESSAGES.GENERAL.REQUIRED_FIELD_MISSING}: Asset Category`,
        HttpStatus.BAD_REQUEST
      );
    }
    const question = await LibraryQuestionnaire.findByPk(id);
    if (!question) {
      throw new CustomError(
        "No question found with the provided id",
        HttpStatus.NOT_FOUND
      );
    }
    if (
      question.assetCategory.length > 1 &&
      question.assetCategory.includes(assetCategory)
    ) {
      const filteredAssetCategory = question.assetCategory.filter(
        (item) => item !== assetCategory
      );
      await LibraryQuestionnaire.update(
        { assetCategory: filteredAssetCategory },
        { where: { questionnaireId: id } }
      );
    } else if (
      question.assetCategory.length === 1 &&
      question.assetCategory[0] === assetCategory
    ) {
      await question.destroy();
    }
    return {
      message: "Question deleted successfully",
    };
  }

  static async updateQuestionnaireStatus(id, status) {
    if (!id) {
      throw new CustomError(
        `${MESSAGES.GENERAL.REQUIRED_FIELD_MISSING}: id`,
        HttpStatus.BAD_REQUEST
      );
    }
    if (!status) {
      throw new CustomError(
        `${MESSAGES.GENERAL.REQUIRED_FIELD_MISSING}: status`,
        HttpStatus.BAD_REQUEST
      );
    }
    const allowed_status_values = ["published", "not_published", "draft"];
    if (!allowed_status_values.includes(status)) {
      throw new CustomError("Invalid status", HttpStatus.BAD_REQUEST);
    }
    const [updatedRowsCount] = await LibraryQuestionnaire.update(
      { status },
      { where: { questionnaireId: id } }
    );
    if (updatedRowsCount === 0) {
      throw new CustomError(
        "No question found with provided id",
        HttpStatus.NOT_FOUND
      );
    }
    return {
      message: "Status of question updated successfully",
    };
  }

  static async downloadQuestionnaireTemplateFile(res) {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=questionnaire_import_template.csv"
    );

    const csvStream = format({ headers: true });
    csvStream.pipe(res);

    csvStream.write({
      "Asset Category":
        "List of asset categories separated by comma. E.g., Windows,macOS,Linux,Office 365,Azure AD,Google Workspace,SaaS,IaaS,Network Devices,Containers",
      Question: "Question (Text)",
      "MITRE Control ID":
        "List of MITRE Control IDs separated by comma. E.g., M1049,M1040,M1050,M1044,M1021",
    });

    csvStream.end();
  }

  static async exportQuestionnaireCSV(res) {
    const connection = await sequelize.connectionManager.getConnection();
    try {
      const sql = `SELECT * FROM library_questionnaire ORDER BY created_date ASC`;
      const query = new QueryStream(sql);
      const stream = connection.query(query);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-disposition",
        "attachment; filename=questionnaire_export.csv"
      );

      const csvStream = format({
        headers: true,
        transform: (row) => ({
          "Question Code": row.question_code,
          Question: row.question,
          "Asset Category": row.asset_category,
          "MITRE Control ID": row.mitre_control_id,
          Status: row.status,
          "Created Date": row.created_date,
          "Modified Date": row.modified_date,
        }),
      });

      stream.on("end", () => {
        sequelize.connectionManager.releaseConnection(connection);
      });
      stream.pipe(csvStream).pipe(res);
    } catch (err) {
      sequelize.connectionManager.releaseConnection(connection);
      throw new Error(err);
    }
  }

  static validateQuestionnaireData(data) {
    if (!data.assetCategory || data.assetCategory.length < 1) {
      throw new CustomError(
        "Asset Category(s) is/are required",
        HttpStatus.BAD_REQUEST
      );
    }
    if (!data.question) {
      throw new CustomError("Question is required", HttpStatus.BAD_REQUEST);
    }
    if (!data.mitreControlId || data.mitreControlId.length < 1) {
      throw new CustomError(
        "MITRE Control ID is required",
        HttpStatus.BAD_REQUEST
      );
    }
  }
}

module.exports = QuestionnaireService;
