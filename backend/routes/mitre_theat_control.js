const express = require('express');
const router = express.Router();
const Messages = require('../constants/messages');
const HttpStatus = require('../constants/httpStatusCodes');
const MitreThreatControlService = require("../services/mitre_threat_control")
const multer = require("multer");

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


router.post('/', async (req, res) => {
    console.log("Request received for Mitre Threat Control creation", req.body);
    try {
        const mitreThreatControlRecord = await MitreThreatControlService.createMitreThreatControlRecord(req.body);
        res.status(HttpStatus.CREATED).json({
            data: mitreThreatControlRecord,
            msg: Messages.MITRE_THREAT_CONTROL.CREATED
        });
    } catch (err) {
        res.status(HttpStatus.BAD_REQUEST).json({
            error: err.message || Messages.GENERAL.BAD_REQUEST
        });
    }
});


router.get('/', async (req, res) => {
    try {
        const searchPattern = req.query.search || null;
        const limit = parseInt(req.query?.limit) || 6;
        const page = parseInt(req.query?.page) || 0;
        const sortBy = req.query.sort_by || 'created_at';
        const sortOrder = req.query.sort_order?.toUpperCase() || "DESC";

        const mitreThreatControlRecords = await MitreThreatControlService.getAllMitreTheatControlRecords(page, limit, searchPattern, sortBy, sortOrder);
        res.status(HttpStatus.OK).json({
            data: mitreThreatControlRecords,
            msg: Messages.MITRE_THREAT_CONTROL.FETCHED
        });
    } catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message || Messages.GENERAL.SERVER_ERROR
        });
    }
});


router.get("/download-template-file", async (req, res) => {
    try {
        await MitreThreatControlService.downloadMitreThreatControlImportTemplateFile(res);
    } catch (err) {
        console.log(Messages.MITRE_THREAT_CONTROL.FAILED_TO_DOWNLOAD_TEMPLATE_FILE ,err);
        res.status(HttpStatus.NOT_FOUND).json({
            error: err.message || Messages.MITRE_THREAT_CONTROL.FAILED_TO_DOWNLOAD_TEMPLATE_FILE
        });
    }
});

router.post("/import", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error("File is required!")
        }
        const filePath = req.file.path;
        const insertedRowCount = await MitreThreatControlService.importMitreThreatControlRecordFromCSV(filePath);
        res.status(HttpStatus.OK).json({
            data: insertedRowCount,
            msg: Messages.MITRE_THREAT_CONTROL.IMPORTED_SUCCESSFULLY
        });
    } catch (err) {
        console.log("Failed to upload process", err || Messages.MITRE_THREAT_CONTROL.FAILED_TO_IMPORT_CSV);
        res.status(HttpStatus.BAD_REQUEST).json({
            error: err.message || Messages.MITRE_THREAT_CONTROL.FAILED_TO_IMPORT_CSV
        });
    }
})

router.get("/export", async (req, res) => {
    try {
        await MitreThreatControlService.exportMitreThreatControlCSV(res);
    } catch (err) {
        console.log(Messages.MITRE_THREAT_CONTROL.FAILED_TO_EXPORT_CSV ,err);
        res.status(HttpStatus.NOT_FOUND).json({
            error: err.message || Messages.MITRE_THREAT_CONTROL.FAILED_TO_EXPORT_CSV
        });
    }
});

/**
 * @route GET /asset/:id
 * @description Get a asset by ID
 * @param {String} req.params.id - asset ID
 * @returns {JSON} 200 - Process object
 * @returns {JSON} 404 - Not found error
 */
router.get('/:id', async (req, res) => {
    try {
        const process = await MitreThreatControlService.getMitreThreatControlRecordById(req.params.id);
        res.status(HttpStatus.OK).json({
            data: process,
            msg: Messages.MITRE_THREAT_CONTROL.FETCHED_BY_ID
        });
    } catch (err) {
        res.status(HttpStatus.NOT_FOUND).json({
            error: err.message || Messages.MITRE_THREAT_CONTROL.NOT_FOUND
        });
    }
});

/**
 * @route DELETE /asset/:id
 * @description Delete a asset by ID
 * @param {String} req.params.id - asset ID
 * @returns {JSON} 200 - Success message
 * @returns {JSON} 404 - asset not found or deletion failed
 */
router.delete('/:id', async (req, res) => {
    try {
        await MitreThreatControlService.deleteMitreThreatControlRecordById(req.params.id);
        res.status(HttpStatus.OK).json({
            msg: Messages.MITRE_THREAT_CONTROL.DELETED
        });
    } catch (err) {
        res.status(HttpStatus.NOT_FOUND).json({
            error: err.message || Messages.MITRE_THREAT_CONTROL.NOT_FOUND
        });
    }
});

module.exports = router;
