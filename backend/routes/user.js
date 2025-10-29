const express = require("express");
const router = express.Router();
const Messages = require("../constants/messages");
const HttpStatus = require("../constants/httpStatusCodes");
const CustomError = require("../utils/CustomError");
const UserService = require("../services/userService");

router.post("/", async (req, res) => {
  try {
    const reqBody = req.body;
    const createdUser = await UserService.createUser(reqBody);
    res.status(HttpStatus.CREATED).json({
      data: {
        userId: createdUser.userId,
        name: createdUser.name,
        email: createdUser.email,
      },
      message: Messages.USER.CREATED,
    });
  } catch (err) {
    console.error("Error creating an user:", err);
    res.status(HttpStatus.BAD_REQUEST).json({
      error: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const orgId = req.query.orgId || null;
    const users = await UserService.getAllUsers(orgId);
    res.status(HttpStatus.OK).json({
      data: users,
      message: Messages.USER.FETCHED,
    });
  } catch (err) {
    console.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message || Messages.GENERAL.SERVER_ERROR,
    });
  }
});

router.get("/roles", async (req, res) => {
  try {
    const roles = await UserService.getAllRoles();
    res.status(HttpStatus.OK).json({
      data: roles,
      message: "Roles fetched successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message || Messages.GENERAL.SERVER_ERROR,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserService.getUserById(id);
    res.status(HttpStatus.OK).json({
      data: user,
      message: Messages.USER.FETCHED_BY_ID,
    });
  } catch (err) {
    console.error("Error fetching an user by id:", err);
    res.status(HttpStatus.NOT_FOUND).json({
      error: err.message || Messages.USER.NOT_FOUND,
    });
  }
});

module.exports = router;
