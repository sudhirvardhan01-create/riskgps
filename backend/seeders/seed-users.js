const bcrypt = require("bcryptjs");
const { Role, User } = require("../models");
const { safeSeed } = require("../utils/seedHelper");

module.exports = {
  up: async () => {
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const role = await Role.findOne({
      where: { name: "Admin" },
    });

    const adminUser = [
      {
        name: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        phone: "1234567890",
        organisation: "Admin Org",
        message: "Welcome to the admin dashboard",
        communicationPreference: "Email",
        roleId: role.roleId,
      },
    ];

    await safeSeed(User, adminUser, "email");
  },

  down: async () => {
    await User.destroy({ truncate: true, cascade: true });
  },
};
