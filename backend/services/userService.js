const db = require('../models');
const CustomError = require('../utils/CustomError');
const Messages = require('../constants/messages');
const HttpStatus = require('../constants/httpStatusCodes');

exports.getAllUsers = async () => {
    console.log('Fetching all users');

    const users = await db.User.findAll();

    if (!users || users.length === 0) {
        console.log('No users found');
        throw new CustomError(Messages.USER.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    console.log(`Found ${users.length} users`);
    return {
        data: users,
        message: Messages.USER.FETCHED
    };
};

exports.createUser = async (name) => {
    console.log('Creating user with name:', name);

    if (!name) {
        console.log('Name is missing in createUser');
        throw new CustomError(Messages.GENERAL.REQUIRED_FIELD_MISSING + ': name', HttpStatus.BAD_REQUEST);
    }

    const newUser = await db.User.create({ name });

    console.log('User created successfully with ID:', newUser.id);
    return {
        data: newUser,
        message: Messages.USER.CREATED
    };
};
