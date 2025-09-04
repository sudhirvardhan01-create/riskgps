const { sequelize, MitreThreatControl, FrameWorkControl } = require("../models");


class ControlsService {
    static async getAllControl(searchPattern = null) {
        const whereClause = this.handleControlsFilters(searchPattern);

        const includeRelation = { model: FrameWorkControl, as: 'framework_controls' }

        const data = await MitreThreatControl.findAll({
            attributes: [
                'id',
                'mitreControlId',
                'mitreControlName',
                'mitreControlType',
                'mitreControlDescription',
                'bluOceanControlDescription',
                'status',
                'created_at',
                'updated_at'

            ],
            where: whereClause,
            include: includeRelation
        });

        let val = data.map((s) => s.toJSON());
        console.log(val)

        const grouped = Object.values(
            data.reduce((acc, row) => {
                const key = row.mitreControlId;

                if (!acc[key]) {
                    acc[key] = {
                        id: row.id,
                        mitreControlId: row.mitreControlId,
                        mitreControlName: row.mitreControlName,
                        mitreControlType: row.mitreControlType,
                        subControls: [],
                        nistControls: [],
                        status: row.status,
                        created_at: row.created_at,
                        updated_at: row.updated_at,
                    };
                }

                // loop through framework_controls if present
                if (row.framework_controls && row.framework_controls.length > 0) {
                    row.framework_controls.forEach(fc => {
                        acc[key].nistControls.push({
                            id: fc.id,
                            frameWorkName: fc.frameWorkName,
                            frameWorkControlCategoryId: fc.frameWorkControlCategoryId,
                            frameWorkControlCategory: fc.frameWorkControlCategory,
                            frameWorkControlDescription: fc.frameWorkControlDescription,
                            frameWorkControlSubCategoryId: fc.frameWorkControlSubCategoryId,
                            frameWorkControlSubCategory: fc.frameWorkControlSubCategory
                        });
                    });
                }

                // push sub-control details
                acc[key].subControls.push({
                    mitreControlDescription: row.mitreControlDescription,
                    bluOceanControlDescription: row.bluOceanControlDescription,
                });

                return acc;
            }, {})
        );

        console.log(grouped);
        return grouped
    }

    static async createControl() {

    }

    static async deleteControl() {

    }

    static handleControlsFilters(
        searchPattern = null,
        statusFilter = [],
        attrFilters = []
    ) {
        let conditions = [];

        if (searchPattern) {
            conditions.push({
                [Op.or]: [
                    { mitreControlName: { [Op.iLike]: `%${searchPattern}%` } },
                    { mitreControlType: { [Op.iLike]: `%${searchPattern}%` } },
                    { mitreControlDescription: { [Op.iLike]: `%${searchPattern}%` } },
                    { bluOceanControlDescription: { [Op.iLike]: `%${searchPattern}%` } },
                ],
            });
        }
        return conditions.length > 0 ? { [Op.and]: conditions } : {};
    }
}

module.exports = ControlsService;