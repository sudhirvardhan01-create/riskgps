const bcrypt = require("bcryptjs");
const { Role, User } = require("../models");
const { safeSeed } = require("../utils/seedHelper");

module.exports = {
  up: async () => {
    const hashedPassword1 = await bcrypt.hash("Admin@123", 10);
    const hashedPassword2 = await bcrypt.hash("Vishal@123", 10);
    const hashedPassword3 = await bcrypt.hash("Priti@123", 10);
    const hashedPassword4 = await bcrypt.hash("abc12345", 10);

    const role = await Role.findOne({
      where: { name: "Admin" },
    });

    const adminUser = [
      {
        name: "admin",
        email: "admin@bluoceancyber.com",
        password: hashedPassword1,
        phone: "1234567890",
        organisation: "Admin Org",
        message: "Welcome to the admin dashboard",
        communicationPreference: "Email",
        roleId: role.roleId,
      },
      {
        name: "Vishal Chawla",
        email: "vishal@bluoceancyber.com",
        password: hashedPassword2,
        phone: "1234567891",
        organisation: "BluOcean Cyber",
        message: "Welcome to the admin dashboard",
        communicationPreference: "Email",
        roleId: role.roleId,
      },
      {
        name: "Priti Patil",
        email: "priti.patil@bluoceancyber.com",
        password: hashedPassword3,
        phone: "1234567892",
        organisation: "BluOcean Cyber",
        message: "Welcome to the admin dashboard",
        communicationPreference: "Email",
        roleId: role.roleId,
      },
      {
        name: "Prabhat Jha",
        email: "prabhat.jha@bluoceancyber.com",
        password: hashedPassword4,
        phone: "1234567893",
        organisation: "BluOcean Cyber",
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
