const { sequelize, User, Role, Organization } = require("../models");
const { Op } = require("sequelize");
const CustomError = require("../utils/CustomError");
const Messages = require("../constants/messages");
const HttpStatus = require("../constants/httpStatusCodes");
const { v4: uuidv4 } = require("uuid");

class UserService {
  static async createUser(data) {
    this.validateUserData(data);
  }

  static async getAllUsers(orgId = null) {
    console.log("Fetching all users");

    const whereClause = {};
    if (orgId) {
      whereClause.organizationId = orgId;
    }

    const users = await User.findAll({
      where: whereClause,
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["name"],
        },
        {
          model: Organization,
          as: "organization",
          attributes: ["name"],
        },
      ],
      attributes: [
        "userId",
        "userCode",
        "name",
        "email",
        "phone",
        "organisation",
        "communicationPreference",
        "isTermsAndConditionsAccepted",
        "isActive",
        "createdDate",
        "modifiedDate",
        "isDeleted",
      ],
      order: [["createdDate", "DESC"]],
    });

    if (!users || users.length === 0) {
      console.log("No users found");
      // throw new CustomError(Messages.USER.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    console.log(`Found ${users.length} users`);

    const result = users.map((u) => ({
      userId: u.userId,
      userCode: u.userCode,
      name: u.name,
      email: u.email,
      phone: u.phone,
      communicationPreference: u.communicationPreference,
      company: u.organisation,
      organisation: u.organization ? u.organization.name : null,
      role: u.role ? u.role.name : null,
      isTermsAndConditionsAccepted: u.isTermsAndConditionsAccepted,
      isActive: u.isActive,
      createdDate: u.createdDate,
      modifiedDate: u.modifiedDate,
      createdBy: null,
      modifiedBy: null,
      isDeleted: u.isDeleted,
    }));
    return result;
  }

  static validateUserData(data) {
    if (!data.name) {
      throw new CustomError("User name is required", HttpStatus.BAD_REQUEST);
    }
    if (!data.email) {
      throw new CustomError("User Email is required", HttpStatus.BAD_REQUEST);
    }
    if (!data.password) {
      throw new CustomError(
        "Password is required while creating an user",
        HttpStatus.BAD_REQUEST
      );
    }
    if (!data.company) {
      throw new CustomError("Company is required", HttpStatus.BAD_REQUEST);
    }
  }
}

module.exports = UserService;
