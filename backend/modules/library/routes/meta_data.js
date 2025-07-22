const express = require('express');
const router = express.Router();
const MetaDataService = require('../services/meta_data');

/**
 * @route POST /api/metadata
 * @description Create a new metadata entry.
 * 
 * @body {string} name - The name of the metadata.
 * @body {string} type - The data type (e.g., 'text', 'number', etc.).
 * @body {string[]} applies_to - Array of entities this metadata applies to (e.g., 'risk_scenario', 'asset').
 * @body {string[]} [supported_values] - Optional array of supported values (for enums or multi-choice fields).
 * 
 * @returns {201 Created} The newly created metadata object.
 * @returns {400 Bad Request} If validation fails or required fields are missing.
 * 
 * @example
 * POST /metadata
 * {
 *   "name": "Severity",
 *   "type": "enum",
 *   "applies_to": ["risk_scenario", "process"],
 *   "supported_values": ["Low", "Medium", "High"]
 * }
 */
router.post('/', async (req, res) => {
  try {
    const metadata = await MetaDataService.createMetaData(req.body);
    res.status(201).json({
      data: metadata,
      msg: "created meta data successfully"
    });
  } catch (err) {
    console.log("[create metadata] request failed", err);
    res.status(400).json({ error: err.message });
  }
});


/**
 * @route   GET /api/metadata
 * @desc    Retrieve all metadata records, optionally filtered by query parameters.
 * @query   {string} [name] - Optional name filter (case-insensitive, partial match).
 * @query   {string} [applies_to] - Optional applies_to filter; matches specific or 'all'.
 * @returns {Object[]} 200 - Array of metadata records.
 * @returns {Object} 500 - Internal server error.
 *
 * @example
 * // Get all metadata
 * GET /api/metadata
 *
 * // Filter by name
 * GET /api/metadata?name=threat
 *
 * // Filter by applies_to
 * GET /api/metadata?applies_to=risk_scenario
 */
router.get('/', async (req, res) => {
  try {
    const filter = req.query;
    const allMetadata = await MetaDataService.getAllMetaData(filter);
    res.status(200).json({
      data: allMetadata,
      msg: "obtained all meta data"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * @route   GET /api/metadata/:id
 * @desc    Retrieve a single metadata record by its ID.
 * @param   {string} id - The unique identifier of the metadata.
 * @returns {Object} 200 - Metadata object if found.
 * @returns {Object} 404 - Error if metadata not found.
 *
 * @example
 * GET /api/metadata/123
 */
router.get('/:id', async (req, res) => {
  try {
    const metadata = await MetaDataService.getMetaDataById(req.params.id);
    res.status(200).json({
      data: metadata,
      msg: "obtained meta daya"
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
 * @route PUT /api/risk-scenario/:id
 */
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const response = await MetaDataService.updateMetaData(id, body);
    res.status(200).json({ 
      data: response,
      msg: "meta data update successfully"
    })
  } catch (err) {
    console.log("Failed to update the Meta data", err);
    res.status(404).json({"message": err.message });
  }
})

/**
 * @route   DELETE /api/metadata/:id
 * @desc    Delete a metadata record by its ID.
 * @param   {string} id - The unique identifier of the metadata to delete.
 * @returns {Object} 200 - Success message or deleted metadata info.
 * @returns {Object} 404 - Error if metadata not found or deletion fails.
 *
 * @example
 * DELETE /api/metadata/123
 */
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params?.id;
    const response = await MetaDataService.deleteMetadata(id);
    res.status(200).json({
      msg: "meta data deleted successfully"
    });
  } catch (err) {
    console.log("Failed to delete Meta Data", err);
    res.status(404).json({ error: err.message });
  }
})

module.exports = router;
