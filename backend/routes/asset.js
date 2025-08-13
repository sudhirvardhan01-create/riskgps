const express = require('express');
const router = express.Router();
const HttpStatus = require('../../../constants/httpStatusCodes');
const Messages = require('../../../constants/messages');

// Static mock data
const mockAsset = {
    id: '8f7a9a48-2e2f-4e13-a7e0-3cfdab59cc82',
    name: 'Name',
    owner: 'Owner',
    it_owner: 'IT Owner',
    third_party_management: 'Yes/No',
    third_party_name: 'Third Party Name',
    third_party_location: 'Third Party Location',
    hosting: 'Hosting',
    hosting_facility: 'Hosting Facility',
    cloud_server_provider: 'Cloud Server Provider',
    geographic_location: 'Geographic Location',
    redundancy: 'Yes/No',
    databases: 'Databases',
    network_segmentation: 'Yes/No',
    network_home: 'Network Home'
};

/**
 * @route POST /
 * @description Create new asset
 * @param {Object} req.body - Asset object to be created
 * @returns {JSON} 201 - Created asset with success message
 * @returns {JSON} 400 - Bad request with error message
 */
router.post('/', async (req, res) => {
    try {
        const asset = { ...mockAsset, ...req.body };
        res.status(HttpStatus.CREATED).json({
            data: asset,
            msg: Messages.ASSET.CREATED
        });
    } catch (err) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: 'Failed to create asset.' });
    }
});

/**
 * @route GET /
 * @description Get all assets
 * @returns {JSON} 200 - List of assets
 */
router.get('/', async (req, res) => {
    try {
        res.status(HttpStatus.OK).json({
            data: [mockAsset],
            msg: Messages.ASSET.OBTAINED
        });
    } catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch assets.' });
    }
});

/**
 * @route GET /:id
 * @description Get asset by ID
 * @param {String} req.params.id - Asset ID
 * @returns {JSON} 200 - Asset object
 * @returns {JSON} 404 - Asset not found
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (id === mockAsset.id) {
            res.status(HttpStatus.OK).json({
                data: mockAsset,
                msg: Messages.ASSET.OBTAINED
            });
        } else {
            throw new Error('Asset not found');
        }
    } catch (err) {
        res.status(HttpStatus.NOT_FOUND).json({ error: err.message });
    }
});

/**
 * @route PUT /:id
 * @description Update asset by ID
 * @param {String} req.params.id - Asset ID
 * @param {Object} req.body - Updated asset fields
 * @returns {JSON} 200 - Updated asset
 * @returns {JSON} 404 - Asset not found
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (id === mockAsset.id) {
            const updatedAsset = { ...mockAsset, ...req.body };
            res.status(HttpStatus.OK).json({
                data: updatedAsset,
                msg: Messages.ASSET.UPDATED
            });
        } else {
            throw new Error('Asset not found');
        }
    } catch (err) {
        res.status(HttpStatus.NOT_FOUND).json({ error: err.message });
    }
});

/**
 * @route DELETE /:id
 * @description Delete asset by ID
 * @param {String} req.params.id - Asset ID
 * @returns {JSON} 200 - Deletion success message
 * @returns {JSON} 404 - Asset not found
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (id === mockAsset.id) {
            res.status(HttpStatus.OK).json({
                msg: Messages.ASSET.DELETED
            });
        } else {
            throw new Error('Asset not found');
        }
    } catch (err) {
        res.status(HttpStatus.NOT_FOUND).json({ error: err.message });
    }
});

module.exports = router;
