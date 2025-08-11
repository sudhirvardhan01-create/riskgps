const express = require('express');
const router = express.Router();
const MetaDataService = require('../services/meta_data');
const HttpStatus = require('../../../constants/httpStatusCodes');
const Messages = require('../../../constants/messages');

/**
 * @route POST /
 * @description Create new metadata
 * @param {Object} req.body - Metadata object to be created
 * @returns {JSON} 201 - Created metadata with success message
 * @returns {JSON} 400 - Bad request with error message
 */
router.post('/', async (req, res) => {
    console.log("request re");
    try {
        const metadata = await MetaDataService.createMetaData(req.body);
        res.status(HttpStatus.CREATED).json({
            data: metadata,
            msg: Messages.META_DATA.CREATED
        });
    } catch (err) {
        console.log("[create metadata] request failed", err);
        res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
    }
});

/**
 * @route GET /
 * @description Get all metadata with optional filters
 * @param {Object} req.query - Filters for metadata
 * @returns {JSON} 200 - Array of metadata with success message
 * @returns {JSON} 500 - Internal server error with message
 */
router.get('/', async (req, res) => {
    try {
        const filter = req.query;
        const allMetadata = await MetaDataService.getAllMetaData(filter);
        res.status(HttpStatus.OK).json({
            data: allMetadata,
            msg: Messages.META_DATA.OBTAINED
        });
    } catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
});

/**
 * @route GET /:id
 * @description Get a single metadata entry by ID
 * @param {String} req.params.id - Metadata ID
 * @returns {JSON} 200 - Metadata object with success message
 * @returns {JSON} 404 - Metadata not found with error message
 */
router.get('/:id', async (req, res) => {
    try {
        const metadata = await MetaDataService.getMetaDataById(req.params.id);
        res.status(HttpStatus.OK).json({
            data: metadata,
            msg: Messages.META_DATA.OBTAINED
        });
    } catch (err) {
        res.status(HttpStatus.NOT_FOUND).json({ error: err.message });
    }
});

/**
 * @route PUT /:id
 * @description Update metadata by ID
 * @param {String} req.params.id - Metadata ID
 * @param {Object} req.body - Updated metadata fields
 * @returns {JSON} 200 - Updated metadata with success message
 * @returns {JSON} 404 - Metadata not found or update failed
 */
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const response = await MetaDataService.updateMetaData(id, body);
        res.status(HttpStatus.OK).json({
            data: response,
            msg: Messages.META_DATA.UPDATED
        });
    } catch (err) {
        console.log("Failed to update the Meta data", err);
        res.status(HttpStatus.NOT_FOUND).json({ message: err.message });
    }
});

/**
 * @route DELETE /:id
 * @description Delete metadata by ID
 * @param {String} req.params.id - Metadata ID
 * @returns {JSON} 200 - Deletion success message
 * @returns {JSON} 404 - Metadata not found or deletion failed
 */
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params?.id;
        const response = await MetaDataService.deleteMetadata(id);
        res.status(HttpStatus.OK).json({
            msg: Messages.META_DATA.DELETED
        });
    } catch (err) {
        console.log("Failed to delete Meta Data", err);
        res.status(HttpStatus.NOT_FOUND).json({ error: err.message });
    }
});

module.exports = router;