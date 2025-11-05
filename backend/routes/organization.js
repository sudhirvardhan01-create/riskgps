const express = require("express");
const router = express.Router();
const Messages = require("../constants/messages");
const HttpStatus = require("../constants/httpStatusCodes");
const OrganizationService = require("../services/organization_service");

/**
 * @route GET /organization
 * @description Get all organizations with optional filtering + pagination
 */
router.get("/", async (req, res) => {
  try {
    const searchPattern = req.query.search || null;
    const limit = parseInt(req.query?.limit) || 10;
    const page = parseInt(req.query?.page) || 0;
    const sortBy = req.query.sort_by || "created_date";
    const sortOrder = req.query.sort_order?.toUpperCase() || "DESC";

    const organizations = await OrganizationService.getAllOrganizations(
      page,
      limit,
      searchPattern,
      sortBy,
      sortOrder
    );

    res.status(HttpStatus.OK).json({
      data: organizations,
      msg: Messages.ORGANIZATION.FETCHED,
    });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message || Messages.GENERAL.SERVER_ERROR,
    });
  }
});

/**
 * @route GET /organization/:id
 * @description Get organization by ID (with business units)
 */
router.get("/:id", async (req, res) => {
  try {
    const organization = await OrganizationService.getOrganizationById(
      req.params.id
    );
    res.status(HttpStatus.OK).json({
      data: organization,
      msg: Messages.ORGANIZATION.FETCHED_BY_ID,
    });
  } catch (err) {
    res.status(err.statusCode || HttpStatus.NOT_FOUND).json({
      error: err.message || Messages.ORGANIZATION.NOT_FOUND,
    });
  }
});

/**
 * @route GET /organization/:orgId/business-unit/:businessUnitId/processes
 * @description Get all processes for a given organization + business unit (both mandatory)
 */
router.get(
  "/:orgId/business-unit/:businessUnitId/processes",
  async (req, res) => {
    try {
      const { orgId, businessUnitId } = req.params;
      if (!orgId || !businessUnitId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message:
            "Organization ID and Business unit ID is required in the URL",
        });
      }

      const processes = await OrganizationService.getOrganizationProcesses(
        orgId,
        businessUnitId
      );

      res.status(HttpStatus.OK).json({
        data: processes,
        msg: Messages.ORGANIZATION.PROCESSES_FETCHED,
      });
    } catch (err) {
      res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: err.message || Messages.GENERAL.SERVER_ERROR,
      });
    }
  }
);

/**
 * @route GET /organization/:orgId/business-unit/:businessUnitId/processes
 * @description Get all processes for a given organization + business unit (both mandatory)
 */
router.get(
  "/:orgId/business-unit/:businessUnitId/processes-v2",
  async (req, res) => {
    try {
      const { orgId, businessUnitId } = req.params;

      if (!orgId || !businessUnitId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message:
            "Organization ID and Business unit ID is required in the URL",
        });
      }
      const processes = await OrganizationService.getOrganizationProcessesV2(
        orgId,
        businessUnitId
      );

      res.status(HttpStatus.OK).json({
        data: processes,
        msg: Messages.ORGANIZATION.PROCESSES_FETCHED,
      });
    } catch (err) {
      res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: err.message || Messages.GENERAL.SERVER_ERROR,
      });
    }
  }
);

router.post(
  "/:orgId/business-unit/:businessUnitId/process",
  async (req, res) => {
    try {
      const { orgId, businessUnitId } = req.params;
      console.log({ orgId, businessUnitId })
      if (!orgId || !businessUnitId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message:
            "Organization ID and Business unit ID is required in the URL",
        });
      }

      const scenarios = await OrganizationService.createProcessByOrgIdAndBuId(
        orgId,
        businessUnitId,
        req.body
      );

      res.status(HttpStatus.OK).json({
        message: "Organization process created successfully",
        data: scenarios,
      });
    } catch (err) {
      res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: err.message || "Failed to create organization process",
      });
    }
  }
);

router.put(
  "/:orgId/business-unit/:businessUnitId/process/:id",
  async (req, res) => {
    try {
      const { id, orgId, businessUnitId } = req.params;
      console.log({ id ,orgId, businessUnitId })
      if (!id || !orgId || !businessUnitId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message:
            "Process ID, Organization ID and Business unit ID is required in the URL",
        });
      }

      const process = await OrganizationService.updateProcess(
        id,
        orgId,
        businessUnitId,
        req.body
      );

      res.status(HttpStatus.OK).json({
        message: "Organization process updated successfully",
        data: process,
      });
    } catch (err) {
      res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: err.message || "Failed to update organization process",
      });
    }
  }
);


router.delete(
  "/:orgId/business-unit/:businessUnitId/process",
  async (req, res) => {
    try {
      const { orgId, businessUnitId } = req.params;
      const ids = req.body.id ?? null;
      if (!ids || !Array.isArray(ids) || !orgId || !businessUnitId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message:
            "Process ID array, Organization ID and Business unit ID is required in the URL",
        });
      }

      const process = await OrganizationService.deleteProcess(
        ids,
        orgId,
        businessUnitId,
      );

      res.status(HttpStatus.OK).json({
        message: "Organization process deleted successfully",
        data: process,
      });
    } catch (err) {
      res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: err.message || "Failed to delete organization process",
      });
    }
  }
);
/**
 * @route GET /organization/:orgId/risk-scenarios
 * @desc Get all risk scenarios for an organization
 */
router.get("/:orgId/risk-scenarios", async (req, res) => {
  try {
    const { orgId } = req.params;

    if (!orgId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Organization ID is required in the URL",
      });
    }

    const scenarios = await OrganizationService.getRiskScenariosByOrgId(orgId);

    res.status(HttpStatus.OK).json({
      message: "Organization risk scenarios fetched successfully",
      data: scenarios,
    });
  } catch (err) {
    res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message || "Failed to fetch organization risk scenarios",
    });
  }
});

/**
 * @route GET /organization/:orgId/risk-scenarios
 * @desc Get all risk scenarios for an organization
 */
router.get("/:orgId/risk-scenarios-v2", async (req, res) => {
  try {
    const { orgId } = req.params;

    if (!orgId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Organization ID is required in the URL",
      });
    }

    const scenarios = await OrganizationService.getRiskScenariosByOrgIdV2(
      orgId
    );

    res.status(HttpStatus.OK).json({
      message: "Organization risk scenarios fetched successfully",
      data: scenarios,
    });
  } catch (err) {
    res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message || "Failed to fetch organization risk scenarios",
    });
  }
});

/**
 * @route GET /organization/:orgId/risk-scenarios
 * @desc Get all risk scenarios for an organization
 */
router.post("/:orgId/risk-scenarios", async (req, res) => {
  try {
    const { orgId } = req.params;

    if (!orgId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Organization ID is required in the URL",
      });
    }

    const scenarios = await OrganizationService.createRiskScenariosByOrgId(
      orgId,
      req.body
    );

    res.status(HttpStatus.OK).json({
      message: "Organization risk scenarios created successfully",
      data: scenarios,
    });
  } catch (err) {
    res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message || "Failed to create organization risk scenarios",
    });
  }
});


router.put("/:orgId/risk-scenarios/:id", async (req, res) => {
  try {
    const { id , orgId } = req.params;

    if (!id || !orgId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "id and Organization ID is required in the URL",
      });
    }

    const scenarios = await OrganizationService.updateRiskScenario(
      id,
      orgId,
      req.body
    );

    res.status(HttpStatus.OK).json({
      message: "Organization risk scenarios updated successfully",
      data: scenarios,
    });
  } catch (err) {
    res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message || "Failed to update organization risk scenarios",
    });
  }
});

router.delete("/:orgId/risk-scenarios", async (req, res) => {
  try {
    const { orgId } = req.params;
    const ids = req.body.id ?? null;
    
    if (!Array.isArray(ids) || !orgId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "id array and Organization ID is required in the URL",
      });
    }

    const scenarios = await OrganizationService.deleteRiskScenario(
      ids,
      orgId,
    );

    res.status(HttpStatus.OK).json({
      message: "Organization risk scenarios deleted successfully",
      data: scenarios,
    });
  } catch (err) {
    res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message || "Failed to delete organization risk scenarios",
    });
  }
});


/**
 * @route GET /organization/:orgId/risk-scenarios
 * @desc Get all risk scenarios for an organization
 */
router.get("/:orgId/threats", async (req, res) => {
  try {
    const { orgId } = req.params;

    if (!orgId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Organization ID is required in the URL",
      });
    }

    const scenarios = await OrganizationService.getOrganizationMitreThreatsByOrgId(
      orgId
    );

    res.status(HttpStatus.OK).json({
      message: "Organization mitre threats fetched successfully",
      data: scenarios,
    });
  } catch (err) {
    res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message || "Failed to fetch organization mitre threats",
    });
  }
});

/**
 * @route GET /organization/:orgId/risk-scenarios
 * @desc Get all risk scenarios for an organization
 */
router.post("/:orgId/threats", async (req, res) => {
  try {
    const { orgId } = req.params;

    if (!orgId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Organization ID is required in the URL",
      });
    }

    const scenarios = await OrganizationService.createMitreThreatByOrgId(
      orgId,
      req.body
    );

    res.status(HttpStatus.OK).json({
      message: "Organization mitre threat created successfully",
      data: scenarios,
    });
  } catch (err) {
    res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message || "Failed to create organization mitre threat",
    });
  }
});


/**
 * @route GET /organization/:orgId/taxonomies
 * @desc Get all taxonomies and severity levels for an organization
 */
router.get("/:orgId/taxonomies", async (req, res) => {
  try {
    const { orgId } = req.params;

    if (!orgId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Organization ID is required in the URL",
      });
    }

    const taxonomies = await OrganizationService.getTaxonomiesWithSeverity(
      orgId
    );

    res.status(HttpStatus.OK).json({
      message:
        "Organization taxonomies with severity levels fetched successfully",
      data: taxonomies,
    });
  } catch (err) {
    res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message || "Failed to fetch taxonomies with severity levels",
    });
  }
});

/**
 * @route GET /organization/:orgId/assets
 * @description Get all assets for a given organization
 */
router.get("/:orgId/assets", async (req, res) => {
  try {
    const { orgId } = req.params;

    if (!orgId) {
      return res.status(400).json({
        message: "Organization ID is required",
      });
    }

    const assets = await OrganizationService.getAssetsByOrgId(orgId);

    res.status(200).json({
      message: "Organization assets fetched successfully",
      data: assets,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message || "Failed to fetch organization assets",
    });
  }
});

/**
 * @route GET /organization/:orgId/assets
 * @description Get all assets for a given organization
 */
router.get("/:orgId/assets-v2", async (req, res) => {
  try {
    const { orgId } = req.params;

    if (!orgId) {
      return res.status(400).json({
        message: "Organization ID is required",
      });
    }

    const assets = await OrganizationService.getAssetsByOrgIdV2(orgId);

    res.status(200).json({
      message: "Organization assets fetched successfully",
      data: assets,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message || "Failed to fetch organization assets",
    });
  }
});

router.post("/:orgId/asset", async (req, res) => {
  try {
    const { orgId } = req.params;

    if (!orgId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Organization ID is required in the URL",
      });
    }

    const scenarios = await OrganizationService.createAssetByOrgId(
      orgId,
      req.body
    );

    res.status(HttpStatus.OK).json({
      message: "Organization asset created successfully",
      data: scenarios,
    });
  } catch (err) {
    res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message || "Failed to created org asset",
    });
  }
});

router.put("/:orgId/asset/:id", async (req, res) => {
  try {
    const { id, orgId } = req.params;

    if (!id || !orgId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "asset id and Organization ID is required in the URL",
      });
    }

    const scenarios = await OrganizationService.updateAsset(
      id,
      orgId,
      req.body
    );

    res.status(HttpStatus.OK).json({
      message: "Organization asset updated successfully",
      data: scenarios,
    });
  } catch (err) {
    res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message || "Failed to update org asset",
    });
  }
});

router.delete("/:orgId/asset/", async (req, res) => {
  try {
    const { orgId } = req.params;
    const ids = req.body.id ?? null;

    if (!Array.isArray(ids) || !orgId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "asset id array and Organization ID is required in the URL",
      });
    }

    const scenarios = await OrganizationService.deleteAsset(
      ids,
      orgId
    );

    res.status(HttpStatus.OK).json({
      message: "Organization asset deleted successfully",
      data: scenarios,
    });
  } catch (err) {
    res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message || "Failed to delete org asset",
    });
  }
});
/**
 * @route POST /organization
 * @desc Create a new organization
 */
router.post("/", async (req, res) => {
  try {
    const data = await OrganizationService.createOrganization(req.body);

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: "Organization created successfully",
      data,
    });
  } catch (error) {
    res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        message: error.message,
      },
    });
  }
});

/**
 * @route PUT /organization/:id
 * @description Update organization by ID
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedOrg = await OrganizationService.updateOrganizationById(
      req.params.id,
      req.body,
      req.user?.id || null
    );

    res.status(HttpStatus.OK).json({
      data: updatedOrg,
      msg: Messages.ORGANIZATION.UPDATED,
    });
  } catch (err) {
    res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message,
    });
  }
});

/**
 * @route DELETE /organization/:id
 * @description Soft delete organization by ID
 */
router.delete("/:id", async (req, res) => {
  try {
    const result = await OrganizationService.deleteOrganizationById(
      req.params.id,
      req.body.modifiedBy // pass logged-in user ID here
    );

    res.status(HttpStatus.OK).json({
      msg: result.message,
    });
  } catch (err) {
    res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message || "Failed to delete organization",
    });
  }
});

// ---------------------------------------------------------------------------
// ORGANIZATION BUSINESS UNIT
// ---------------------------------------------------------------------------

/**
 * @route GET /organization/:orgId/business-units
 * @desc Get all business units for a specific organization
 */
router.get("/:orgId/business-units", async (req, res) => {
  try {
    const { orgId } = req.params;
    const searchPattern = req.query.search || "";
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sort_by || "created_date";
    const sortOrder = req.query.sort_order?.toUpperCase() || "DESC";

    const result = await OrganizationService.getBusinessUnitsByOrganizationId(
      orgId,
      page,
      limit,
      searchPattern,
      sortBy,
      sortOrder
    );

    res.status(HttpStatus.OK).json({
      data: result,
      msg: "Business units fetched successfully",
    });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message,
    });
  }
});

/**
 * @route GET /organization/business-unit/:id
 * @desc Get single business unit by ID
 */
router.get("/business-unit/:id", async (req, res) => {
  try {
    const result = await OrganizationService.getBusinessUnitById(req.params.id);
    res.status(HttpStatus.OK).json({
      data: result,
      msg: "Business unit fetched successfully",
    });
  } catch (err) {
    res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message,
    });
  }
});

/**
 * @route POST /organization/:orgId/business-units
 * @desc Create business unit under organization
 */
router.post("/:orgId/business-units", async (req, res) => {
  try {
    const { orgId } = req.params;
    const result = await OrganizationService.createBusinessUnit(
      orgId,
      req.body
    );
    res.status(HttpStatus.CREATED).json({
      message: "Business unit created successfully",
      data: result,
    });
  } catch (err) {
    res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message,
    });
  }
});

/**
 * @route PUT /organization/business-unit/:id
 * @desc Update business unit
 */
router.put("/business-unit/:id", async (req, res) => {
  try {
    const result = await OrganizationService.updateBusinessUnitById(
      req.params.id,
      req.body
    );
    res.status(HttpStatus.OK).json({
      message: "Business unit updated successfully",
      data: result,
    });
  } catch (err) {
    res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message,
    });
  }
});

/**
 * @route DELETE /organization/business-unit/:id
 * @desc Soft delete business unit
 */
router.delete("/business-unit/:id", async (req, res) => {
  try {
    const result = await OrganizationService.deleteBusinessUnitById(
      req.params.id,
      req.body.modifiedBy
    );
    res.status(HttpStatus.OK).json({ message: result.message });
  } catch (err) {
    res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message,
    });
  }
});


/**
 * @route POST /organization/:orgId/taxonomies
 * @desc Create taxonomies with severity levels for an organization
 */
router.post("/:orgId/taxonomies", async (req, res) => {
    try {
        const { orgId } = req.params;
        const { taxonomies } = req.body; // Expecting an array of taxonomy objects with severity levels

        if (!orgId) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: "Organization ID is required in the URL",
            });
        }

        if (!Array.isArray(taxonomies) || taxonomies.length === 0) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: "At least one taxonomy with severity levels is required",
            });
        }

        const result = await OrganizationService.saveTaxonomiesWithSeverity(orgId, taxonomies);

        res.status(HttpStatus.CREATED).json({
            message: "Organization taxonomies and severity levels saved successfully",
            data: result,
        });
    } catch (err) {
        res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message || "Failed to save taxonomies with severity levels",
        });
    }
});



module.exports = router;
