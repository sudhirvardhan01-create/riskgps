const express = require('express');
const router = express.Router();
const ProcessService = require("../services/process");
const Messages = require("../../../constants/messages");
const HttpStatus = require('../../../constants/httpStatusCodes');

/**
 * @route POST /process
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

// Get All Processes (optional filter by name)
router.get('/', async (req, res) => {
    try {
        const filters = { name: req.query.name };
        const limit = parseInt(req.query?.limit) || 6;
        const page = parseInt(req.query?.page) || 0;

        const processes = await ProcessService.getAllProcesses(page, limit, filters);
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

// Get Process by ID
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

// Update Process
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

// Patch - Update Process Status
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

// Delete Process
router.delete('/:id', async (req, res) => {
    try {
        await ProcessService.deleteProcess(req.params.id);
        res.status(HttpStatus.OK).json({
            msg: Messages.PROCESS.DELETED
        });
    } catch (err) {
        res.status(HttpStatus.NOT_FOUND).json({
            error: err.message || Messages.PROCESS.NOT_FOUND
        });
    }
});

module.exports = router;