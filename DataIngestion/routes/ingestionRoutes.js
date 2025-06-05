const express = require('express');
const router = express.Router();
const ingestionController = require('../controllers/ingestionController');

router.post('/ingest', ingestionController.ingestData);
router.get('/status/:ingestion_id', ingestionController.getStatus);

module.exports = router;
