const express = require('express');
const router = express.Router();
const ProcessService = require("../services/process");
const Messages = require('../constants/messages');
const HttpStatus = require('../constants/httpStatusCodes');
const AssetService = require('../services/assetService');

/**
 * @route POST /asset
 * @description Create a new Asset
 * @param {Object} req.body - Asset data to be created
 * @returns {JSON} 201 - Created Asset with success message
 * @returns {JSON} 400 - Bad request with error message
 */
router.post('/', async (req, res) => {
    console.log("Request received for asset creation", req.body);
    try {
        const process = await AssetService.createAsset(req.body);
        res.status(HttpStatus.CREATED).json({
            data: process,
            msg: Messages.ASSET.CREATED
        });
    } catch (err) {
        res.status(HttpStatus.BAD_REQUEST).json({
            error: err.message || Messages.GENERAL.BAD_REQUEST
        });
    }
});

/**
 * @route GET /asset
 * @description Get all assets with optional filtering by name and pagination
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
        console.log(sortBy, sortOrder)

        const processes = await AssetService.getAllAssets(page, limit, searchPattern, sortBy, sortOrder);
        res.status(HttpStatus.OK).json({
            data: processes,
            msg: Messages.ASSET.FETCHED
        });
    } catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message || Messages.GENERAL.SERVER_ERROR
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
        const process = await AssetService.getAssetById(req.params.id);
        res.status(HttpStatus.OK).json({
            data: process,
            msg: Messages.ASSET.FETCHED_BY_ID
        });
    } catch (err) {
        res.status(HttpStatus.NOT_FOUND).json({
            error: err.message || Messages.PROCESS.NOT_FOUND
        });
    }
});

/**
 * @route PUT /asset/:id
 * @description Update a asset by ID
 * @param {String} req.params.id - asset ID
 * @param {Object} req.body - Updated asset data
 * @returns {JSON} 200 - Updated asset object
 * @returns {JSON} 404 - Not found or update failed
 */
router.put('/:id', async (req, res) => {
    try {
        const process = await AssetService.updateAsset(req.params.id, req.body);
        res.status(HttpStatus.OK).json({
            data: process,
            msg: Messages.ASSET.UPDATED
        });
    } catch (err) {
        res.status(HttpStatus.NOT_FOUND).json({
            error: err.message || Messages.PROCESS.NOT_FOUND
        });
    }
});

/**
 * @route PATCH /asset/update-status/:id
 * @description Update the status of a asset
 * @param {String} req.params.id - asset ID
 * @param {String} req.body.status - New status value
 * @returns {JSON} 200 - Success message
 * @returns {JSON} 404 - asset not found or update failed
 */
router.patch("/update-status/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;

        await AssetService.updateAssetStatus(id, status);
        res.status(HttpStatus.OK).json({
            msg: Messages.ASSET.STATUS_UPDATED
        });
    } catch (err) {
        console.log("Failed operation: update status", err);
        res.status(HttpStatus.NOT_FOUND).json({
            error: err.message || Messages.PROCESS.NOT_FOUND
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
        await AssetService.deleteAssetById(req.params.id);
        res.status(HttpStatus.OK).json({
            msg: Messages.ASSET.DELETED
        });
    } catch (err) {
        res.status(HttpStatus.NOT_FOUND).json({
            error: err.message || Messages.PROCESS.NOT_FOUND
        });
    }
});


// router.get("/download", )
module.exports = router;
