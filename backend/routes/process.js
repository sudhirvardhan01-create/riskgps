const express = require('express');
const router = express.Router();
const ProcessService = require("../services/process");
const Messages = require('../constants/messages');
const HttpStatus = require('../constants/httpStatusCodes');

/**
 * @route POST /process
 * @description Create a new process
 * @param {Object} req.body - Process data to be created
 * @returns {JSON} 201 - Created process with success message
 * @returns {JSON} 400 - Bad request with error message
 */
router.post('/', async (req, res) => {
    console.log("Request received for process creation", req.body);
    try {
        const process = await ProcessService.createProcess(req.body);
        res.status(HttpStatus.CREATED).json({
            data: process,
            msg: Messages.PROCESS.CREATED
        });
    } catch (err) {
        res.status(HttpStatus.BAD_REQUEST).json({
            error: err.message || Messages.GENERAL.BAD_REQUEST
        });
    }
});

/**
 * @route GET /process
 * @description Get all processes with optional filtering by name and pagination
 * @param {String} [req.query.name] - Optional process name filter
 * @param {Number} [req.query.limit=6] - Number of records per page
 * @param {Number} [req.query.page=0] - Page number
 * @returns {JSON} 200 - List of processes
 * @returns {JSON} 500 - Server error with message
 */
router.get('/', async (req, res) => {
    try {
        const searchPattern = req.query.search || null;
        const limit = parseInt(req.query?.limit) || 6;
        const page = parseInt(req.query?.page) || 0;
        const sortBy = req.query.sort_by || 'created_at'
        const sortOrder = req.query.sort_order?.toUpperCase() || 'DESC'
        const statusFilter = req.query.status ? req.query.status?.split(",") : [];
        const attrFilters = (req.query.attributes || "")
          .split(";")
          .map((expr) => {
            if (!expr) return null;
            const [metaDataKeyId, values] = expr.split(":");
            return { metaDataKeyId, values: values.split(",") };
          })
          .filter(Boolean);

        const processes = await ProcessService.getAllProcesses(page, limit, searchPattern, sortBy, sortOrder, statusFilter, attrFilters);
        res.status(HttpStatus.OK).json({
            data: processes,
            msg: Messages.PROCESS.FETCHED
        });
    } catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message || Messages.GENERAL.SERVER_ERROR
        });
    }
});

/**
 * @route GET /process/:id
 * @description Get a process by ID
 * @param {String} req.params.id - Process ID
 * @returns {JSON} 200 - Process object
 * @returns {JSON} 404 - Not found error
 */
router.get('/:id', async (req, res) => {
    try {
        const process = await ProcessService.getProcessById(req.params.id);
        res.status(HttpStatus.OK).json({
            data: process,
            msg: Messages.PROCESS.FETCHED_BY_ID
        });
    } catch (err) {
        res.status(HttpStatus.NOT_FOUND).json({
            error: err.message || Messages.PROCESS.NOT_FOUND
        });
    }
});

router.get("/download-processes", async (req, res) => {
    try {
        await ProcessService.downloadProcessCSV(res);
    } catch (err) {
        console.log(Messages.PROCESS.FAILED_TO_DOWNLOAD_PROCESS_CSV ,err);
        res.status(HttpStatus.NOT_FOUND).json({
            error: err.message || Messages.PROCESS.FAILED_TO_DOWNLOAD_PROCESS_CSV
        });
    }
});

/**
 * @route PUT /process/:id
 * @description Update a process by ID
 * @param {String} req.params.id - Process ID
 * @param {Object} req.body - Updated process data
 * @returns {JSON} 200 - Updated process object
 * @returns {JSON} 404 - Not found or update failed
 */
router.put('/:id', async (req, res) => {
    try {
        const process = await ProcessService.updateProcess(req.params.id, req.body);
        res.status(HttpStatus.OK).json({
            data: process,
            msg: Messages.PROCESS.UPDATED
        });
    } catch (err) {
        res.status(HttpStatus.NOT_FOUND).json({
            error: err.message || Messages.PROCESS.NOT_FOUND
        });
    }
});

/**
 * @route PATCH /process/update-status/:id
 * @description Update the status of a process
 * @param {String} req.params.id - Process ID
 * @param {String} req.body.status - New status value
 * @returns {JSON} 200 - Success message
 * @returns {JSON} 404 - Process not found or update failed
 */
router.patch("/update-status/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;

        await ProcessService.updateProcessStatus(id, status);
        res.status(HttpStatus.OK).json({
            msg: Messages.PROCESS.STATUS_UPDATED
        });
    } catch (err) {
        console.log("Failed operation: update status", err);
        res.status(HttpStatus.NOT_FOUND).json({
            error: err.message || Messages.PROCESS.NOT_FOUND
        });
    }
});

/**
 * @route DELETE /process/:id
 * @description Delete a process by ID
 * @param {String} req.params.id - Process ID
 * @returns {JSON} 200 - Success message
 * @returns {JSON} 404 - Process not found or deletion failed
 */
router.delete('/:id', async (req, res) => {
    try {
        await ProcessService.deleteProcess(req.params.id);
        res.status(HttpStatus.OK).json({
            msg: Messages.PROCESS.DELETED
        });
    } catch (err) {
        console.log(err || Messages.PROCESS.NOT_FOUND);
        res.status(HttpStatus.NOT_FOUND).json({
            error: err.message || Messages.PROCESS.NOT_FOUND
        });
    }
});

module.exports = router;