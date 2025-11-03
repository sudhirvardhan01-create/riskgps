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
    const statusCode = err.statusCode || HttpStatus.BAD_REQUEST;
    res.status(statusCode).json({
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

router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const reqBody = req.body;
    const user = await UserService.updateUserById(id, reqBody);
    res.status(HttpStatus.OK).json({
      data: user,
      message: Messages.USER.UPDATED,
    });
  } catch (err) {
    console.log(err);
    res.status(HttpStatus.NOT_FOUND).json({
      error: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserService.deleteUserById(id);
    res.status(HttpStatus.OK).json({
      data: {
        name: user.name,
        email: user.email,
      },
      message: Messages.USER.DELETED,
    });
  } catch (err) {
    console.log(err);
    res.status(HttpStatus.NOT_FOUND).json({
      error: err.message,
    });
  }
});

router.patch("/update-status/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.isActive;
    const user = await UserService.updateStatus(id, status);
    res.status(HttpStatus.OK).json({
      data: {
        name: user.name,
        email: user.email,
      },
      message: "User status updated successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(HttpStatus.NOT_FOUND).json({
      error: err.message,
    });
  }
});

module.exports = router;
