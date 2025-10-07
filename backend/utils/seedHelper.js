// utils/seedHelper.js
"use strict";

module.exports.safeSeed = async function safeSeed(
  Model,
  records,
  ...uniqueKeys
) {
  if (!Array.isArray(records) || records.length === 0) {
    console.warn(`⚠️ No records provided for ${Model.name}`);
    return;
  }

  for (const record of records) {
    try {
      // Build dynamic where clause using unique keys
      const where = {};
      for (const key of uniqueKeys) {
        if (record[key] !== undefined) {
          where[key] = record[key];
        } else {
          console.warn(`⚠️ Missing key "${key}" in record for ${Model.name}`);
        }
      }

      // Try to find or create the record
      await Model.findOrCreate({
        where,
        defaults: record,
      });
    } catch (error) {
      console.error(`❌ Error seeding ${Model.name}:`, error.message);
    }
  }

  console.log(`✅ Safe seed completed for ${Model.name}`);
};
