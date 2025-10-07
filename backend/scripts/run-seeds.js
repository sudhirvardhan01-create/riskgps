const { execSync } = require("child_process");

const seeds = [
  "seed-roles.js",
  "seed-users.js",
  "seed-organization.js",
  "seed-organization-business-units.js",
  "seed-organization-process.js",
  "seed-organization-risk-scenarios.js",
  "seed-organization-taxonomy.js",
  "seed-organization-severity.js",
  "seed-organization-assets.js",
];

(async () => {
  try {
    for (const seed of seeds) {
      console.log(`\n🌱 Running seed: ${seed}`);
      execSync(`npx sequelize-cli db:seed --seed ${seed}`, {
        stdio: "inherit",
      });
    }
    console.log("\n✅ All seeds completed successfully!");
  } catch (err) {
    console.error("\n❌ Seed failed:", err.message);
    process.exit(1);
  }
})();
