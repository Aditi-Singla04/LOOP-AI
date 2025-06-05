function calculateOverallStatus(batches) {
  const statuses = batches.map(batch => batch.status);

  if (statuses.every(status => status === 'yet_to_start')) {
    return 'yet_to_start';
  }

  if (statuses.every(status => status === 'completed')) {
    return 'completed';
  }

  return 'triggered';
}

module.exports = {
  calculateOverallStatus,
};
