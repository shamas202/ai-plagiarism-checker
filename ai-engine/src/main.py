"""
FastAPI application for AI Plagiarism Detection Engine.
Mirrors Node.js hand-off flow for completeness.
"""
import logging
import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any

from fastapi import FastAPI, UploadFile, File, Form, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import jwt

from src.core.config import settings
from src.celery_worker.tasks import process_document_task
from src.services.vector_store import VectorStoreService
from src.services.database import DatabaseService

logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper()),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered plagiarism detection with semantic analysis and stylometry",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL or "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Tenant-ID", "X-Department-ID"],
)

vector_store = None
db_service = None


def get_vector_store() -> VectorStoreService:
    """Lazy-init vector store."""
    global vector_store
    if vector_store is None:
        vector_store = VectorStoreService()
    return vector_store


def get_db_service() -> DatabaseService:
    """Lazy-init database service."""
    global db_service
    if db_service is None:
        db_service = DatabaseService()
    return db_service


class UploadResponse(BaseModel):
    success: bool
    message: str
    data: Dict[str, Any]


class StatusResponse(BaseModel):
    success: bool
    data: Dict[str, Any]


def decode_jwt(authorization: str) -> dict:
    """Decode and validate JWT from Authorization header."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization header required")

    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, os.getenv("JWT_SECRET", "secret"), algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def verify_tenant_context(payload: dict) -> tuple:
    """Extract and validate tenant context from JWT payload."""
    tenant_id = payload.get("tenantId")
    department_id = payload.get("departmentId")
    user_id = payload.get("userId")

    if not all([tenant_id, department_id, user_id]):
        raise HTTPException(
            status_code=403,
            detail="Invalid token: missing tenant or department context",
        )

    return str(tenant_id), str(department_id), str(user_id)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    vs = get_vector_store()
    db = get_db_service()

    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "services": {
            "qdrant": vs.health_check(),
            "postgres": db.health_check(),
        },
    }


@app.post("/api/documents/upload", response_model=UploadResponse)
async def upload_document(
    document: UploadFile = File(...),
    enableStylometry: Optional[str] = Form("true"),
    enableSemanticSearch: Optional[str] = Form("true"),
    authorization: str = Header(None),
):
    """
    Upload document for plagiarism analysis.

    Mirrors Node.js hand-off: validates, queues to Celery, returns job_id immediately.
    """
    try:
        user_payload = decode_jwt(authorization)
        tenant_id, department_id, user_id = verify_tenant_context(user_payload)
    except HTTPException:
        raise

    allowed_mime_types = {
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "text/plain",
        "text/markdown",
    }

    if document.content_type not in allowed_mime_types:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed: {', '.join(allowed_mime_types)}",
        )

    content = await document.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit")

    upload_dir = Path(settings.STORAGE_PATH) / tenant_id / datetime.utcnow().date().isoformat()
    upload_dir.mkdir(parents=True, exist_ok=True)

    file_id = str(uuid.uuid4())
    file_ext = os.path.splitext(document.filename)[1] or ".bin"
    file_path = upload_dir / f"{file_id}{file_ext}"

    with open(file_path, "wb") as f:
        f.write(content)

    logger.info(f"File stored | Path: {file_path} | Size: {len(content)}")

    processing_payload = {
        "jobId": str(uuid.uuid4()),
        "tenantId": tenant_id,
        "departmentId": department_id,
        "userId": user_id,
        "document": {
            "originalName": document.filename,
            "mimeType": document.content_type,
            "size": len(content),
            "storagePath": str(file_path),
            "storageProvider": "local",
        },
        "processingOptions": {
            "enableStylometry": enableStylometry == "true",
            "enableSemanticSearch": enableSemanticSearch != "false",
            "chunkSize": settings.CHUNK_SIZE,
            "chunkOverlap": settings.CHUNK_OVERLAP,
            "minSimilarityThreshold": settings.MIN_SIMILARITY_THRESHOLD,
        },
        "metadata": {
            "uploadedAt": datetime.utcnow().isoformat(),
        },
    }

    job = process_document_task.delay(processing_payload)

    logger.info(f"Document queued | Job: {job.id} | Department: {department_id}")

    return UploadResponse(
        success=True,
        message="Document uploaded and queued for processing",
        data={
            "jobId": job.id,
            "statusUrl": f"/api/documents/status/{job.id}",
            "estimatedProcessingTime": "30-60 seconds per page",
        },
    )


@app.get("/api/documents/status/{job_id}", response_model=StatusResponse)
async def get_document_status(job_id: str, authorization: str = Header(None)):
    """Get processing status for a document job."""
    try:
        user_payload = decode_jwt(authorization)
        tenant_id, department_id, user_id = verify_tenant_context(user_payload)
    except HTTPException:
        raise

    db = get_db_service()
    result = db.get_result_by_job_id(job_id)

    if not result:
        raise HTTPException(status_code=404, detail="Job not found")

    if result["tenant_id"] != tenant_id or result["department_id"] != department_id:
        raise HTTPException(status_code=403, detail="Access denied: cross-tenant access blocked")

    return StatusResponse(
        success=True,
        data={
            "jobId": result["job_id"],
            "state": result["status"],
            "progress": 100 if result["status"] == "completed" else 50,
            "result": {
                "similarPassages": result.get("similar_passages", []),
                "stylometry": result.get("stylometry"),
            } if result["status"] == "completed" else None,
            "error": result.get("error_message"),
            "createdAt": result["created_at"],
        },
    )


@app.get("/api/documents/{document_id}/results")
async def get_analysis_results(document_id: str, authorization: str = Header(None)):
    """Get full analysis results for a document."""
    try:
        user_payload = decode_jwt(authorization)
        tenant_id, department_id, user_id = verify_tenant_context(user_payload)
    except HTTPException:
        raise

    db = get_db_service()
    result = db.get_result_by_job_id(document_id)

    if not result:
        raise HTTPException(status_code=404, detail="Results not found")

    if result["tenant_id"] != tenant_id or result["department_id"] != department_id:
        raise HTTPException(status_code=403, detail="Access denied: cross-tenant access blocked")

    return {
        "success": True,
        "data": {
            "documentId": document_id,
            "documentName": result["document_name"],
            "status": result["status"],
            "analysis": {
                "textLength": result["text_length"],
                "chunksProcessed": result["chunk_count"],
                "similarPassages": result["similar_passages"],
                "stylometry": result["stylometry"],
            },
            "createdAt": result["created_at"],
        },
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "src.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.ENVIRONMENT == "development",
    )
# Refinement 10: Adding internal developer notes
# Refinement 14: Improving consistency across the module
# Refinement 23: Refining variable names for clarity
# Refinement 131: Adding descriptive comments for better maintainability
# Refinement 153: Adding internal developer notes
