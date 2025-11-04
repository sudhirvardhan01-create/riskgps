const { sequelize, User, Role, Organization } = require("../models");
const { Op } = require("sequelize");
const CustomError = require("../utils/CustomError");
const Messages = require("../constants/messages");
const HttpStatus = require("../constants/httpStatusCodes");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

class UserService {
  static async createUser(data) {
    this.validateUserData(data);

    //If role exists or not
    const role = await Role.findOne({ where: { roleId: data.role } });
    if (!role) {
      throw new CustomError(Messages.AUTH.INVALID_ROLE, HttpStatus.BAD_REQUEST);
    }

    if (data.organization) {
      const org = await Organization.findOne({
        where: { organizationId: data.organization },
      });
      if (!org) {
        throw new CustomError(
          "Invalid organization specified",
          HttpStatus.BAD_REQUEST
        );
      }
    }

    const existingEmail = await User.findOne({
      where: {
        email: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("email")),
          sequelize.fn("LOWER", data.email.trim())
        ),
      },
    });

    if (existingEmail) {
      throw new CustomError("Email ID already exists", HttpStatus.CONFLICT);
    }

    //Hash Password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      userId: uuidv4(),
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      organisation: data.company,
      communicationPreference: data.communicationPreference,
      roleId: data.role,
      organizationId: data.organization ? data.organization : null,
      isTermsAndConditionsAccepted: data.isTermsAndConditionsAccepted,
      isActive: data.isActive,
      createdDate: new Date(),
      modifiedDate: new Date(),
      isDeleted: false,
    });
    return user;
  }

  static async getAllUsers(orgId = null) {
    console.log("Fetching all users");

    const whereClause = {
      isDeleted: false,
    };
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
      organization: u.organization ? u.organization.name : null,
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

  static async getUserById(id) {
    if (!id) {
      throw new CustomError(
        `${Messages.GENERAL.REQUIRED_FIELD_MISSING}: id`,
        HttpStatus.BAD_REQUEST
      );
    }
    const user = await User.findByPk(id, {
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["roleId", "name"],
        },
        {
          model: Organization,
          as: "organization",
          attributes: ["organizationId", "name"],
        },
      ],
    });
    if (!user) {
      throw new CustomError(Messages.USER.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const result = {
      userId: user.userId,
      userCode: user.userCode,
      name: user.name,
      email: user.email,
      phone: user.phone,
      communicationPreference: user.communicationPreference,
      company: user.organisation,
      organization: user.organization ? user.organization.name : null,
      organizationId: user.organization
        ? user.organization.organizationId
        : null,
      role: user.role ? user.role.name : null,
      roleId: user.role ? user.role.roleId : null,
      isTermsAndConditionsAccepted: user.isTermsAndConditionsAccepted,
      isActive: user.isActive,
      createdDate: user.createdDate,
      modifiedDate: user.modifiedDate,
      createdBy: null,
      modifiedBy: null,
      isDeleted: user.isDeleted,
    };
    return result;
  }

  static async updateUserById(id, data) {
    if (!id) {
      throw new CustomError(
        `${Messages.GENERAL.REQUIRED_FIELD_MISSING}: id`,
        HttpStatus.BAD_REQUEST
      );
    }
    const user = await User.findByPk(id);
    if (!user) {
      throw new CustomError(
        "No user found with the provided id",
        HttpStatus.NOT_FOUND
      );
    }
    if (!data.name) {
      throw new CustomError("User name is required", HttpStatus.BAD_REQUEST);
    }
    if (!data.email) {
      throw new CustomError("User Email is required", HttpStatus.BAD_REQUEST);
    }
    if (!data.company) {
      throw new CustomError("Company is required", HttpStatus.BAD_REQUEST);
    }

    //If role exists or not
    const role = await Role.findOne({ where: { roleId: data.role } });
    if (!role) {
      throw new CustomError(Messages.AUTH.INVALID_ROLE, HttpStatus.BAD_REQUEST);
    }

    if (data.organization) {
      const org = await Organization.findOne({
        where: { organizationId: data.organization },
      });
      if (!org) {
        throw new CustomError(
          "Invalid organization specified",
          HttpStatus.BAD_REQUEST
        );
      }
    }

    const updatedUser = await user.update({
      name: data.name,
      email: data.email,
      phone: data.phone,
      organisation: data.company,
      communicationPreference: data.communicationPreference,
      roleId: data.role,
      organizationId: data.organization,
      modifiedDate: new Date(),
    });
    return updatedUser;
  }

  static async deleteUserById(id) {
    if (!id) {
      throw new CustomError(
        `${Messages.GENERAL.REQUIRED_FIELD_MISSING}: id`,
        HttpStatus.BAD_REQUEST
      );
    }
    const user = await User.findByPk(id);
    if (!user) {
      throw new CustomError(
        "No user found with the provided id",
        HttpStatus.NOT_FOUND
      );
    }
    const deletedUser = await user.update({
      isDeleted: true,
      modifiedDate: new Date(),
    });
    return deletedUser;
  }

  static async updateStatus(id, status) {
    if (!id) {
      throw new CustomError(
        `${Messages.GENERAL.REQUIRED_FIELD_MISSING}: id`,
        HttpStatus.BAD_REQUEST
      );
    }
    const user = await User.findByPk(id);
    if (!user) {
      throw new CustomError(
        "No user found with the provided id",
        HttpStatus.NOT_FOUND
      );
    }
    const updatedUser = await user.update({
      isActive: status,
      modifiedDate: new Date(),
    });
    return updatedUser;
  }

  static async getAllRoles() {
    const roles = await Role.findAll({
      attributes: ["roleId", "name"],
    });
    if (!roles || roles.length === 0) {
      throw new CustomError("No roles found", HttpStatus.NOT_FOUND);
    }
    return roles;
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
