const { GENERAL } = require("../constants/library");
const { sequelize } = require("../models");

class LibraryService {
  static async getLibraryModules() {
    const [riskScenariosSummaryData] = await sequelize.query(`
            SELECT 
            COUNT(*) AS total_count,
            SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS draft,
            SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) AS published,
            SUM(CASE WHEN status = 'not_published' THEN 1 ELSE 0 END) AS not_published
            FROM "library_risk_scenarios";
  `);

    const riskScenariosSummary = {
      total_count: parseInt(riskScenariosSummaryData[0].total_count, 10),
      draft: parseInt(riskScenariosSummaryData[0].draft, 10),
      published: parseInt(riskScenariosSummaryData[0].published, 10),
      not_published: parseInt(riskScenariosSummaryData[0].not_published, 10),
    };

    const [processSummaryData] = await sequelize.query(`
            SELECT 
            COUNT(*) AS total_count,
            SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS draft,
            SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) AS published,
            SUM(CASE WHEN status = 'not_published' THEN 1 ELSE 0 END) AS not_published
            FROM "library_processes";
  `);

    const processSummary = {
      total_count: parseInt(processSummaryData[0].total_count, 10),
      draft: parseInt(processSummaryData[0].draft, 10),
      published: parseInt(processSummaryData[0].published, 10),
      not_published: parseInt(processSummaryData[0].not_published, 10),
    };

    const [assetSummaryData] = await sequelize.query(`
            SELECT 
            COUNT(*) AS total_count,
            SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS draft,
            SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) AS published,
            SUM(CASE WHEN status = 'not_published' THEN 1 ELSE 0 END) AS not_published
            FROM "library_assets";
  `);

    const assetSummary = {
      total_count: parseInt(assetSummaryData[0].total_count, 10),
      draft: parseInt(assetSummaryData[0].draft, 10),
      published: parseInt(assetSummaryData[0].published, 10),
      not_published: parseInt(assetSummaryData[0].not_published, 10),
    };

    const [mitreThreatsCountByStatusData] = await sequelize.query(`
                SELECT status,
                COUNT(DISTINCT mitre_technique_id || '.' || COALESCE(sub_technique_id, '')) AS grouped_count
        FROM "library_mitre_threats_controls"
        GROUP BY status;
        `);

    const mitreThreatsCountByStatus = mitreThreatsCountByStatusData.reduce(
      (acc, row) => {
        acc[row.status] = parseInt(row.grouped_count, 10);
        return acc;
      },
      {}
    );

    GENERAL.STATUS_SUPPORTED_VALUES.forEach((status) => {
      if (!(status in mitreThreatsCountByStatus)) {
        mitreThreatsCountByStatus[status] = 0;
      }
    });

    // total count = sum of all statuses
    const mitreThreatsCount = Object.values(mitreThreatsCountByStatus).reduce(
      (a, b) => a + b,
      0
    );
    mitreThreatsCountByStatus.total_count = mitreThreatsCount;

    const [mitreControlsCountByStatusData] = await sequelize.query(`
                SELECT status,
                COUNT(DISTINCT mitre_control_id) AS grouped_count
                FROM "library_mitre_threats_controls"
                GROUP BY status; `);

    const mitreControlsCountByStatus = mitreControlsCountByStatusData.reduce(
      (acc, row) => {
        acc[row.status] = parseInt(row.grouped_count, 10);
        return acc;
      },
      {}
    );

    GENERAL.STATUS_SUPPORTED_VALUES.forEach((status) => {
      if (!(status in mitreControlsCountByStatus)) {
        mitreControlsCountByStatus[status] = 0;
      }
    });
    // total count = sum of all statuses
    const mitreControlsCount = Object.values(mitreControlsCountByStatus).reduce(
      (a, b) => a + b,
      0
    );
    mitreControlsCountByStatus.total_count = mitreControlsCount;

    return {
      riskScenario: riskScenariosSummary,
      asset: assetSummary,
      process: processSummary,
      mitreThreats: mitreThreatsCountByStatus,
      mitreControls: mitreControlsCountByStatus,
    };
  }
}

module.exports = LibraryService;
