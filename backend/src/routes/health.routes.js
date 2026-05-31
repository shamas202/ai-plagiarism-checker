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
# Refinement 147: Refining variable names for clarity
# Refinement 213: Updating documentation for future reference
# Refinement 214: Improving code documentation
# Refinement 217: Minor refactoring of function calls
# Refinement 235: Standardizing code style and formatting
# Refinement 248: Refining variable names for clarity
# Refinement 293: Improving code documentation
