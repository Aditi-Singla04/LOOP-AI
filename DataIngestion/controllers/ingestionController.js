const ingestionService = require('../services/ingestionServices');
const { calculateOverallStatus } = require('../utils/ingestionUtils');
const { ingestionMap } = require('../data/ingestionStore');

exports.ingestData = (req, res) => {
  try {
    const { ids, priority } = req.body;
    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ error: 'ids must be a non-empty array' });
    }
    if (!['HIGH', 'MEDIUM', 'LOW'].includes(priority)) {
      return res.status(400).json({ error: 'priority must be one of HIGH, MEDIUM, LOW' });
    }

    const ingestion_id = ingestionService.enqueueIngestion(ids, priority);
    return res.status(200).json({ ingestion_id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getStatus = (req, res) => {
  try {
    const { ingestion_id } = req.params;
    const ingestion = ingestionMap[ingestion_id];
    if (!ingestion) {
      return res.status(404).json({ error: 'Invalid ingestion_id' });
    }

    const status = calculateOverallStatus(ingestion.batches);

    return res.status(200).json({
      ingestion_id,
      status,
      batches: ingestion.batches,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
