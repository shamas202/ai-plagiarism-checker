const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../utils/logger');
const { enqueueDocumentForProcessing, getJobStatus } = require('../queues/document.queue');

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
  'text/markdown',
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const validateFile = (file) => {
  if (!file) return { valid: false, error: 'No file uploaded' };

  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return { valid: false, error: 'File type not allowed. Allowed: PDF, DOCX, DOC, TXT, MD' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 10MB limit' };
  }

  return { valid: true };
};

const storeFile = async (file, tenantId) => {
  const uploadDir = path.join(
    process.env.STORAGE_PATH || './uploads',
    tenantId,
    new Date().toISOString().split('T')[0]
  );

  await fs.mkdir(uploadDir, { recursive: true });

  const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
  const filePath = path.join(uploadDir, uniqueFilename);

  await fs.writeFile(filePath, file.buffer);

  return filePath;
};

const uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    const { enableStylometry, enableSemanticSearch } = req.body;

    const validation = validateFile(file);
    if (!validation.valid) {
      logger.warn('File validation failed', { reason: validation.error });
      return res.status(400).json({
        success: false,
        error: validation.error,
        code: 'VALIDATION_FAILED'
      });
    }

    const { tenantId, departmentId } = req.tenantContext;
    const userId = req.user.userId;

    const storagePath = await storeFile(file, tenantId);
    logger.info('File stored', { path: storagePath, size: file.size });

    const processingPayload = {
      tenantId,
      departmentId,
      userId,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      storagePath,
      storageProvider: 'local',
      enableStylometry: enableStylometry === 'true',
      enableSemanticSearch: enableSemanticSearch !== 'false',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };

    const job = await enqueueDocumentForProcessing(processingPayload);

    logger.info('Document upload complete', { jobId: job.id, originalName: file.originalname });

    return res.status(202).json({
      success: true,
      message: 'Document uploaded and queued for processing',
      data: {
        jobId: job.id,
        statusUrl: `/api/documents/status/${job.id}`,
        estimatedProcessingTime: '30-60 seconds per page',
      },
    });
  } catch (error) {
    logger.error('Document upload failed', { error: error.message });
    return res.status(500).json({
      success: false,
      error: 'Failed to process document upload',
      code: 'UPLOAD_FAILED',
    });
  }
};

const getDocumentStatus = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        error: 'Job ID required',
        code: 'JOB_ID_MISSING'
      });
    }

    const jobStatus = await getJobStatus(jobId);

    if (!jobStatus) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
        code: 'JOB_NOT_FOUND'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        jobId: jobStatus.jobId,
        state: jobStatus.state,
        progress: jobStatus.progress,
        result: jobStatus.result,
        failedReason: jobStatus.failedReason,
        attemptsMade: jobStatus.attemptsMade,
        createdAt: jobStatus.timestamp,
        completedAt: jobStatus.finishedOn,
        logs: jobStatus.logs.slice(-5),
      },
    });
  } catch (error) {
    logger.error('Failed to get job status', { error: error.message });
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve job status',
      code: 'STATUS_FETCH_FAILED'
    });
  }
};

const getAnalysisResults = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { tenantId, departmentId } = req.tenantContext;

    logger.info('Analysis results requested', { documentId, tenantId, departmentId });

    return res.status(200).json({
      success: true,
      data: {
        documentId,
        status: 'completed',
        message: 'Results endpoint - connect to PostgreSQL for full implementation',
      },
    });
  } catch (error) {
    logger.error('Failed to get analysis results', { error: error.message });
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve analysis results',
      code: 'RESULTS_FETCH_FAILED'
    });
  }
};

module.exports = {
  uploadDocument,
  getDocumentStatus,
  getAnalysisResults,
};
# Refinement 0: Optimizing logic in small sections
# Refinement 32: Refining variable names for clarity
# Refinement 49: Improving consistency across the module
# Refinement 71: Adding descriptive comments for better maintainability
# Refinement 122: Adding descriptive comments for better maintainability
# Refinement 274: Improving consistency across the module
# Refinement 369: Improving consistency across the module
# Refinement 416: Improving consistency across the module
# Refinement 457: Optimizing logic in small sections
