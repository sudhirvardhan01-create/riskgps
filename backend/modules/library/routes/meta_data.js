const express = require('express');
const router = express.Router();
const MetaDataService = require('../services/meta_data');
const HttpStatus = require('../../../constants/httpStatusCodes');
const Messages = require('../../../constants/messages');

router.post('/', async (req, res) => {
    console.log("request re")
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


router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const response = await MetaDataService.updateMetaData(id, body);
        res.status(HttpStatus.OK).json({
            data: response,
            msg: Messages.META_DATA.UPDATED
        })
    } catch (err) {
        console.log("Failed to update the Meta data", err);
        res.status(HttpStatus.NOT_FOUND).json({ "message": err.message });
    }
})


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
})

module.exports = router;
