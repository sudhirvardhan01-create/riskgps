const express = require("express");
const ControlsService = require("../services/control");
const HttpStatusCodes = require("../constants/httpStatusCodes");
const multer = require("multer");
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
    console.log("got request")
    try {
        const data = await ControlsService.getAllControl();
        res.json({data})

    } catch (error) {
        res.status(400).json({
            msg: "failed to fetch mitre controls "
        })
        console.log(error)
    }
})

router.post("/framework-control", async (req, res) => {
    try {
        const response = await ControlsService.createFrameworkControl(req.body);
        res.status(HttpStatusCodes.CREATED).json({
            data: response,
            msg: "framework control created"
        })
    } catch(err) {
        console.log("Failed to create framework controls", err)
        res.status(HttpStatusCodes.BAD_REQUEST).json({
            msg: err.message
        })
    }
})

router.get("/get-all-framework-control", async (req, res) => {
    try {
        const response = await ControlsService.getAllFrameworkControls();
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


router.get("/download-framework-template",  async (req, res) => {
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