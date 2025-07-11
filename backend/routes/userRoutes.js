const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.get('/', controller.getUsers);

router.post('/', controller.addUser);

module.exports = router;
