# Data Ingestion API

A simple RESTful API built with Node.js and Express to simulate asynchronous data ingestion with priority-based batch processing and rate limiting.

## Features

- Submit ingestion requests with a list of IDs and a priority (HIGH, MEDIUM, LOW).
- Process IDs in batches of 3 asynchronously.
- Enforce rate limit: process 1 batch every 5 seconds.
- Higher priority batches preempt lower priority ones.
- Check ingestion status with batch-level details.
- In-memory storage for ingestion and batch status.

## API Endpoints

### POST /ingest

Submit an ingestion request.

**Request Body:**

```json
{
  "ids": [1, 2, 3, 4, 5],
  "priority": "HIGH"
}
