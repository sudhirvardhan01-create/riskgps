const { GENERAL } = require("../constants/library");
const { sequelize } = require("../models");

class LibraryService {

    static async getLibraryModules() {
        const [riskScenariosSummary] = await sequelize.query(`
            SELECT 
            COUNT(*) AS total_count,
            SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS draft,
            SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) AS published,
            SUM(CASE WHEN status = 'not_published' THEN 1 ELSE 0 END) AS not_published
            FROM "library_risk_scenarios";
  `     );

        const [processSummary] = await sequelize.query(`
            SELECT 
            COUNT(*) AS total_count,
            SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS draft,
            SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) AS published,
            SUM(CASE WHEN status = 'not_published' THEN 1 ELSE 0 END) AS not_published
            FROM "library_processes";
  `     );

        const [assetSummary] = await sequelize.query(`
            SELECT 
            COUNT(*) AS total_count,
            SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS draft,
            SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) AS published,
            SUM(CASE WHEN status = 'not_published' THEN 1 ELSE 0 END) AS not_published
            FROM "library_assets";
  `     );

        const [mitreThreatsCountByStatusData] = await sequelize.query(`
                SELECT status,
                COUNT(DISTINCT mitre_technique_id || '.' || COALESCE(sub_technique_id, '')) AS grouped_count
        FROM "library_mitre_threats_controls"
        GROUP BY status;
        `);

        const mitreThreatsCountByStatus = mitreThreatsCountByStatusData.reduce((acc, row) => {
            acc[row.status] = parseInt(row.grouped_count, 10);
            return acc;
        }, {});

        GENERAL.STATUS_SUPPORTED_VALUES.forEach(status => {
            if (!(status in mitreThreatsCountByStatus)) {
                mitreThreatsCountByStatus[status] = 0;
            }
        });

        // total count = sum of all statuses
        const mitreThreatsCount = Object.values(mitreThreatsCountByStatus).reduce((a, b) => a + b, 0);
        mitreThreatsCountByStatus.total_count = mitreThreatsCount;



        const [mitreControlsCountByStatusData] = await sequelize.query(`
                SELECT status,
                COUNT(DISTINCT mitre_control_id || mitre_control_name) AS grouped_count
                FROM "library_mitre_threats_controls"
                GROUP BY status; `);

        const mitreControlsCountByStatus = mitreControlsCountByStatusData.reduce((acc, row) => {
            acc[row.status] = parseInt(row.grouped_count, 10);
            return acc;
        }, {});

        GENERAL.STATUS_SUPPORTED_VALUES.forEach(status => {
            if (!(status in mitreControlsCountByStatus)) {
                mitreControlsCountByStatus[status] = 0;
            }
        });
        // total count = sum of all statuses
        const mitreControlsCount = Object.values(mitreControlsCountByStatus).reduce((a, b) => a + b, 0);
        mitreControlsCountByStatus.total_count = mitreControlsCount;


        return {
            riskScenario: riskScenariosSummary[0],
            asset: assetSummary[0],
            process: processSummary[0],
            mitreThreats: mitreThreatsCountByStatus,
            mitreControls: mitreControlsCountByStatus
        };
    }
}

module.exports = LibraryService;