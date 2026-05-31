const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Plagiarism Detection API Gateway',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
# Refinement 20: Cleaning up whitespace and indentations
