const express = require("express");
const ControlsService = require("../services/control");
const router = express.Router();

router.get("/get-controls", async (req, res) => {
    console.log("got request")
    try {
        const data = await ControlsService.getAllControl();
        res.json({data})

    } catch (error) {
        console.log(error)
    }
})

module.exports = router;