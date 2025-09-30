const express = require("express");
const ControlsService = require("../services/control");
const HttpStatusCodes = require("../constants/httpStatusCodes");
const multer = require("multer");
const Messages = require("../constants/messages");
const CustomError = require("../utils/CustomError");
const router = express.Router();

const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "text/csv" || file.mimetype === "application/vnd.ms-excel") {
            cb(null, true);
        } else {
            cb(new Error("Only CSV files are allowed"));
        }
    },
});

router.get("/get-controls", async (req, res) => {
    const searchPattern = req.query.search || null;
    const limit = parseInt(req.query?.limit) || 6;
    const page = parseInt(req.query?.page) || 0;
    const sortBy = req.query.sort_by || 'created_at';
    const sortOrder = req.query.sort_order?.toUpperCase() || "DESC";
    const fields = req.query.fields?.split(",") || null;

    try {
        const data = await ControlsService.getAllControl(page, limit, searchPattern, sortBy, sortOrder, fields);
        res.status(200).json({ data });

    } catch (error) {
        res.status(400).json({
            msg: "failed to fetch mitre controls "
        })
        console.log(error)
    }
})


router.patch("/update-mitre-control", async (req, res) => {
    try {

        const data = await ControlsService.updateMitreControls(req.body);
        res.status(HttpStatusCodes.CREATED).json({
            data,
            msg: "mitre control updated"
        })

    } catch (err) {
        console.log("Failed to update mitre control");
        res.status(HttpStatusCodes.BAD_REQUEST).json({
            msg: err.message
        })

    }

})

router.patch("/update-mitre-control-status", async (req, res) => {
    try {
        const mitreControlId = req.query.mitreControlId ?? null;
        const status = req.body.status ?? null;

        if (!mitreControlId) {
            throw new CustomError(Messages.MITRE_CONTROLS.INVALID_MITRE_CONTROL_ID, HttpStatusCodes.BAD_REQUEST);
        }

        if (!status) {
            throw new CustomError("Status required", HttpStatusCodes.BAD_REQUEST);
        }
        const response = await ControlsService.updateMitreControlStatus(mitreControlId, status);
        res.status(HttpStatusCodes.CREATED).json({
            data: response,
            msg: "mitre control status updated"
        })
    } catch (err) {
        console.log("Failed to update framework controls status", err)
        res.status(HttpStatusCodes.BAD_REQUEST).json({
            msg: err.message
        })
    }
})

router.delete("/delete-mitre-control", async (req, res) => {
    try {
        const mitreControlId = req.query.mitreControlId ?? null;
        const mitreControlNames = req.body.mitreControlNames ?? [];

        if (!mitreControlId) {
            throw new CustomError(Messages.MITRE_CONTROLS.INVALID_MITRE_CONTROL_ID, HttpStatusCodes.BAD_REQUEST);
        }

        if (!mitreControlNames || mitreControlNames.length < 1) {
            throw new CustomError("required mitre control names", HttpStatusCodes.BAD_REQUEST);

        }


        const response = await ControlsService.deleteMitreControl(mitreControlId, mitreControlNames);
        res.status(HttpStatusCodes.CREATED).json({
            data: response,
            msg: "mitre control deleted "
        })
    } catch (err) {
        console.log("Failed to  mitre controls delete", err)
        res.status(HttpStatusCodes.BAD_REQUEST).json({
            msg: err.message
        })
    }
})

router.post("/framework-control", async (req, res) => {
    try {

        const response = await ControlsService.createFrameworkControl(req.body);
        res.status(HttpStatusCodes.CREATED).json({
            data: response,
            msg: "framework control created"
        })
    } catch (err) {
        console.log("Failed to create framework controls", err)
        res.status(HttpStatusCodes.BAD_REQUEST).json({
            msg: err.message
        })
    }
})


router.get("/get-all-framework-control", async (req, res) => {
    try {
        const frameworkName = req.query.frameworkName || null
        const searchPattern = req.query.search || null;
        const limit = parseInt(req.query?.limit) || 6;
        const page = parseInt(req.query?.page) || 0;
        const sortBy = req.query.sort_by || 'created_at';
        const sortOrder = req.query.sort_order?.toUpperCase() || "DESC";

        const response = await ControlsService.getAllFrameworkControls(frameworkName, page, limit, searchPattern, sortBy, sortOrder);
        res.status(200).json({
            data: response
        })
    } catch (err) {
        console.log("failed to get all controls");
        res.status(HttpStatusCodes.BAD_REQUEST).json({
            msg: err.message
        })
    }
})

router.put("/framework-control/:id", async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            throw new Error("Invalid request, id required");
        }
        const response = await ControlsService.updateFrameworkControl(id, req.body);
        res.status(HttpStatusCodes.CREATED).json({
            data: response,
            msg: "framework control updated"
        })
    } catch (err) {
        console.log("Failed to update framework control", err)
        res.status(HttpStatusCodes.BAD_REQUEST).json({
            msg: err.message
        })
    }
})

router.patch("/framework-control-update-status/:id", async (req, res) => {
    try {
        const id = req.params.id ?? null;
        const status = req.body.status ?? null;

        if (!id || !status) {
            throw new Error("Failed, id and status required")
        }
        const response = await ControlsService.updateFrameWorkControlStatus(status, id);
        res.status(200).json({
            data: response
        })

    } catch (err) {
        console.log("failed to update status", err);
        res.status(HttpStatusCodes.BAD_REQUEST).json({
            msg: err.message
        })
    }
})


router.delete("/framework-control/:id", async (req, res) => {
    try {
        const id = req.params.id ?? null;

        if (!id) {
            throw new Error("Failed, id required to delete framework control")
        }
        const response = await ControlsService.deleteFrameWorkControl(id);
        res.status(200).json({
            data: response
        })

    } catch (err) {
        console.log("failed to delete", err);
        res.status(HttpStatusCodes.BAD_REQUEST).json({
            msg: err.message
        })
    }
})


router.get("/download-framework-template", async (req, res) => {
    try {
        await ControlsService.downloadFrameworkControlsTemplateFile(res);

    } catch (err) {
        console.log("Failed to download framework template");
        res.status(HttpStatusCodes.BAD_REQUEST).json({
            msg: err.message
        })
    }
})

router.get("/export-frameworks", async (req, res) => {
    try {
        await ControlsService.exportFrameworkControlCSV(res);

    } catch (err) {
        console.log("Failed to download framework template");
        res.status(HttpStatusCodes.BAD_REQUEST).json({
            msg: err.message
        })
    }
})

router.post("/import-framework-controls", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error("File is required!")
        }
        const filePath = req.file.path;
        const insertedRowCount = await ControlsService.importFrameworkControlsFromCSV(filePath);
        res.status(HttpStatusCodes.OK).json({
            data: insertedRowCount
        });
    } catch (err) {
        console.log("Failed to upload process", err || Messages.PROCESS.FAILED_TO_IMPORT_PROCESS_CSV);
        res.status(HttpStatusCodes.BAD_REQUEST).json({
            error: err.message || Messages.PROCESS.FAILED_TO_IMPORT_PROCESS_CSV
        });
    }
})


module.exports = router;