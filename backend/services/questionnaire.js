const { sequelize, LibraryQuestionnaire } = require("../models");
const CustomError = require("../utils/CustomError");
const HttpStatus = require("../constants/httpStatusCodes");
const Messages = require("../constants/messages");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const {
  createdDate,
  modifiedBy,
  isDeleted,
} = require("../models/common_fields");

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
    sortBy = "created_date",
    sortOrder = "ASC"
  ) {
    const data = await LibraryQuestionnaire.findAll({
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
