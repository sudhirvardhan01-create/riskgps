const express = require('express');
const router = express.Router();
const ProcessService = require("../services/process");
const HttpStatus = require('./constants/httpStatusCodes');
/**
 * @route POST /process
 */
router.post('/', async (req, res) => {
  console.log("req recived for process creation", req.body);
  try {
    const process = await ProcessService.createProcess(req.body);
    res.status(HttpStatus.CREATED).json({
      data: process,
      msg: "process created successfully"
    });
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
  }
});

// Get All Processes (optional filter by name)
router.get('/', async (req, res) => {
  try {
    const filters = {
      name: req.query.name,
    };

    const limit = parseInt(req.query?.limit) || 6;
    const page = parseInt(req.query?.page) || 0;
    console.log("aa")
    const processes = await ProcessService.getAllProcesses(page, limit, filters);
    res.status(HttpStatus.OK).json({
      data: processes,
      msg: "fetched all the process"
    });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
});

// Get Process by ID
router.get('/:id', async (req, res) => {
  try {
    const process = await ProcessService.getProcessById(req.params.id);
    res.status(HttpStatus.OK).json({
      data: process,
      msg: "process fetched by ID"
    });
  } catch (err) {
    res.status(HttpStatus.NOT_FOUND).json({ error: err.message });
  }
});

// Update Process
router.put('/:id', async (req, res) => {
  try {
    const process = await ProcessService.updateProcess(req.params.id, req.body);
    res.status(HttpStatus.OK).json({
      data: process,
      msg: "process  updated successfully"
    });
  } catch (err) {
    res.status(HttpStatus.NOT_FOUND).json({ error: err.message });
  }
});

router.patch("/update-status/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;
    const response = await ProcessService.updateProcessStatus(id, status);
    res.status(HttpStatus.OK).json({
      msg: "process Status  updated successfully"
    });

  } catch (err) {
    console.log("failed operation update status", err);
    res.status(HttpStatus.NOT_FOUND).json({ error: err.message });
  }
})

// Delete Process
router.delete('/:id', async (req, res) => {
  try {
    const result = await ProcessService.deleteProcess(req.params.id);
    res.status(HttpStatus.OK).json({
      msg: "process deleted successfully"
    });
  } catch (err) {
    res.status(HttpStatus.NOT_FOUND).json({ error: err.message });
  }
});

module.exports = router;
