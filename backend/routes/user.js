const express = require("express");
const router = express.Router();
const Messages = require("../constants/messages");
const HttpStatus = require("../constants/httpStatusCodes");
const CustomError = require("../utils/CustomError");
const UserService = require("../services/userService");

router.get("/", async (req, res) => {
  try {
    const orgId = req.query.orgId || null;
    const users = await UserService.getAllUsers(orgId);
    res.status(HttpStatus.OK).json({
      result: users,
      message: "Users fetched successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message || Messages.GENERAL.SERVER_ERROR,
    });
  }
});

module.exports = router;
