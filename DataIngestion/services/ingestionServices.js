const { v4: uuidv4 } = require('uuid');
const { ingestionMap, jobQueue } = require('../data/ingestionStore');
const PRIORITY_MAP = { HIGH: 3, MEDIUM: 2, LOW: 1 };

const BATCH_SIZE = 3;

const RATE_LIMIT_MS = 5000;

let processing = false;
let lastBatchTime = 0;

function createBatches(ids) {
  const batches = [];
  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batchIds = ids.slice(i, i + BATCH_SIZE);
    batches.push({
      batch_id: uuidv4(),
      ids: batchIds,
      status: 'yet_to_start',
    });
  }
  return batches;
}

function enqueueIngestion(ids, priority) {
  const ingestion_id = uuidv4();
  const created_time = Date.now();

  const batches = createBatches(ids);
  ingestionMap[ingestion_id] = {
    ingestion_id,
    priority,
    created_time,
    batches,
  };

  batches.forEach(batch => {
    jobQueue.push({
      ingestion_id,
      batch_id: batch.batch_id,
      priority,
      created_time,
      ids: batch.ids,
      status: 'yet_to_start',
    });
  });

  jobQueue.sort((a, b) => {
    if (PRIORITY_MAP[b.priority] !== PRIORITY_MAP[a.priority]) {
      return PRIORITY_MAP[b.priority] - PRIORITY_MAP[a.priority];
    }
    return a.created_time - b.created_time;
  });

  if (!processing) {
    processQueue();
  }

  return ingestion_id;
}

function simulateExternalApiCall(id) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ id, data: 'processed' });
    }, 4000);
  });
}

async function processQueue() {
  processing = true;

  while (jobQueue.length > 0) {
    const now = Date.now();

    const waitTime = RATE_LIMIT_MS - (now - lastBatchTime);
    if (waitTime > 0) {
      await new Promise(res => setTimeout(res, waitTime));
    }

    const job = jobQueue.shift();
    if (!job) break;

    const ingestion = ingestionMap[job.ingestion_id];
    if (!ingestion) continue;

    const batch = ingestion.batches.find(b => b.batch_id === job.batch_id);
    if (!batch) continue;

    batch.status = 'triggered';
    lastBatchTime = Date.now();

    for (const id of batch.ids) {
      await simulateExternalApiCall(id);
    }
    batch.status = 'completed';
  }

  processing = false;
}

module.exports = {
  enqueueIngestion,
};
