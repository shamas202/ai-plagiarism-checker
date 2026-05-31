const express = require('express');
const multer = require('multer');
const { authenticateJWT } = require('../middleware/auth.middleware');
const { enforceTenantIsolation } = require('../middleware/tenant.middleware');
const { uploadDocument, getDocumentStatus, getAnalysisResults } = require('../controllers/document.controller');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.use(authenticateJWT);
router.use(enforceTenantIsolation);

router.post('/upload', upload.single('document'), uploadDocument);
router.get('/status/:jobId', getDocumentStatus);
router.get('/:documentId/results', getAnalysisResults);

module.exports = router;
# Refinement 91: Improving code documentation
# Refinement 176: Updating documentation for future reference
# Refinement 357: Optimizing logic in small sections
# Refinement 6: Minor refactoring of function calls
