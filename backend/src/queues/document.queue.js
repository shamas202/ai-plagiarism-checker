const { Queue } = require('bullmq');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
  maxRetriesPerRequest: null,
};

const documentQueue = new Queue('document_processing', {
  connection,
  defaultJobOptions: {
    removeOnComplete: { age: 3600 },
    removeOnFail: { age: 86400 },
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
  },
});

const enqueueDocumentForProcessing = async (payload) => {
  const jobId = uuidv4();

  const jobPayload = {
    jobId,
    tenantId: payload.tenantId,
    departmentId: payload.departmentId,
    userId: payload.userId,
    document: {
      originalName: payload.originalName,
      mimeType: payload.mimeType,
      size: payload.size,
      storagePath: payload.storagePath,
      storageProvider: payload.storageProvider || 'local',
    },
    processingOptions: {
      enableStylometry: payload.enableStylometry ?? true,
      enableSemanticSearch: payload.enableSemanticSearch ?? true,
      chunkSize: payload.chunkSize || 512,
      chunkOverlap: payload.chunkOverlap ?? 50,
      minSimilarityThreshold: payload.minSimilarityThreshold ?? 0.7,
    },
    metadata: {
      uploadedAt: new Date().toISOString(),
      ipAddress: payload.ipAddress,
      userAgent: payload.userAgent,
    },
  };

  const job = await documentQueue.add('process_document', jobPayload, { jobId });

  logger.info('Document queued for processing', {
    jobId,
    tenantId: payload.tenantId,
    departmentId: payload.departmentId,
    documentName: payload.originalName,
  });

  return job;
};

const getJobStatus = async (jobId) => {
  const job = await documentQueue.getJob(jobId);
  if (!job) return null;

  const state = await job.getState();
  const logs = await job.getLogs();

  return {
    jobId: job.id,
    state,
    progress: job.progress,
    result: job.returnvalue,
    failedReason: job.failedReason,
    attemptsMade: job.attemptsMade,
    logs,
    timestamp: job.timestamp,
    finishedOn: job.finishedOn,
  };
};

process.on('SIGTERM', async () => {
  logger.info('Closing document queue...');
  await documentQueue.close();
});

module.exports = {
  documentQueue,
  enqueueDocumentForProcessing,
  getJobStatus,
};
# Refinement 26: Cleaning up whitespace and indentations
