const express = require('express');
const router = express.Router();
const ProcessService = require("../services/process");

/**
 * @route POST /process
 */
router.post('/', async (req, res) => {
  console.log("req recived");
  try {
    const process = await ProcessService.createProcess(req.body);
    res.status(201).json({
      data: process,
      msg: "process created successfully"
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Processes (optional filter by name)
router.get('/', async (req, res) => {
  try {
    const filters = {
      name: req.query.name,
    };

    const processes = await ProcessService.getAllProcesses(filters);
    res.status(200).json({
      data: processes,
      msg: "fetched all the process"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Process by ID
router.get('/:id', async (req, res) => {
  try {
    const process = await ProcessService.getProcessById(req.params.id);
    res.status(200).json({
      data: process,
      msg: "process fetched by ID"
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Update Process
router.put('/:id', async (req, res) => {
  try {
    const process = await ProcessService.updateProcess(req.params.id, req.body);
    res.status(200).json({
      data: process,
      msg: "process  updated successfully"
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Delete Process
router.delete('/:id', async (req, res) => {
  try {
    const result = await ProcessService.deleteProcess(req.params.id);
    res.status(200).json({
      msg: "process deleted successfully"
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;
