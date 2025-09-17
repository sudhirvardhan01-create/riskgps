const express = require("express");
const HttpStatusCodes = require("../constants/httpStatusCodes");
const router = express.Router();
const LibraryService = require("../services/library_service");

router.get("/summary", async (req, res) => {
    try {
        const data = await LibraryService.getLibraryModules()
        res.status(HttpStatusCodes.OK).json({
            data: data,
            msg: "fetched library details"
        });
    } catch (err) {
        console.log("Failed to fetch summary", err);
        res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
    }
})

module.exports = router;