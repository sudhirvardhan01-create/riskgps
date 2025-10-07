const { Role } = require("../models");
const { safeSeed } = require("../utils/seedHelper");

module.exports = {
  up: async () => {
    const roles = [
      { name: "Admin", roleKey: "admin" },
      { name: "User", roleKey: "user" },
      { name: "Organization Admin", roleKey: "org_admin" },
    ];

    await safeSeed(Role, roles, "name");
  },

  down: async () => {
    await Role.destroy({ truncate: true, cascade: true });
  },
};
