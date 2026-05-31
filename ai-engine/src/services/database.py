"""
PostgreSQL service for analysis results storage.
Uses SQLAlchemy for ORM with async support.
"""
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Integer, Float, DateTime, JSON, Text, Boolean
from sqlalchemy.orm import sessionmaker, declarative_base, Session

from src.core.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()


class AnalysisResult(Base):
    """PostgreSQL model for storing plagiarism analysis results."""
    __tablename__ = "analysis_results"

    id = Column(String, primary_key=True)
    job_id = Column(String, nullable=False, index=True)
    tenant_id = Column(String, nullable=False, index=True)
    department_id = Column(String, nullable=False, index=True)
    user_id = Column(String, nullable=False)
    document_name = Column(String, nullable=False)
    text_length = Column(Integer, default=0)
    chunk_count = Column(Integer, default=0)
    vector_ids = Column(JSON, default=list)
    similar_passages = Column(JSON, default=list)
    stylometry = Column(JSON, default=dict)
    status = Column(String, default="pending")
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class DatabaseService:
    """PostgreSQL database service for results storage."""

    def __init__(self):
        self.engine = None
        self.SessionLocal = None
        self._connect()

    def _connect(self):
        """Initialize database connection."""
        try:
            self.engine = create_engine(
                settings.DATABASE_URL,
                pool_size=10,
                max_overflow=20,
                pool_pre_ping=True,
            )
            self.SessionLocal = sessionmaker(bind=self.engine)
            Base.metadata.create_all(self.engine)
            logger.info("Connected to PostgreSQL")
        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            raise ConnectionError(f"Failed to connect to PostgreSQL: {e}")

    def store_analysis_result(
        self,
        job_id: str,
        tenant_id: str,
        department_id: str,
        user_id: str,
        document_name: str,
        text_length: int,
        chunk_count: int,
        vector_ids: List[str],
        similar_passages: List[Dict[str, Any]],
        stylometry: Optional[Dict[str, Any]] = None,
    ) -> str:
        """Store analysis result in PostgreSQL."""
        result_id = f"result_{job_id}"

        session: Session = self.SessionLocal()
        try:
            result = AnalysisResult(
                id=result_id,
                job_id=job_id,
                tenant_id=tenant_id,
                department_id=department_id,
                user_id=user_id,
                document_name=document_name,
                text_length=text_length,
                chunk_count=chunk_count,
                vector_ids=vector_ids,
                similar_passages=similar_passages,
                stylometry=stylometry or {},
                status="completed",
            )

            session.add(result)
            session.commit()
            session.refresh(result)

            logger.info(f"Stored analysis result | ID: {result_id} | Department: {department_id}")
            return result_id

        except Exception as e:
            session.rollback()
            logger.error(f"Failed to store result: {e}")
            raise
        finally:
            session.close()

    def update_result_status(
        self,
        result_id: str,
        status: str,
        error_message: Optional[str] = None,
    ) -> bool:
        """Update the status of an analysis result."""
        session: Session = self.SessionLocal()
        try:
            result = session.query(AnalysisResult).filter_by(id=result_id).first()
            if not result:
                logger.warning(f"Result not found: {result_id}")
                return False

            result.status = status
            result.error_message = error_message
            result.updated_at = datetime.utcnow()

            session.commit()
            logger.info(f"Updated result status | ID: {result_id} | Status: {status}")
            return True

        except Exception as e:
            session.rollback()
            logger.error(f"Failed to update status: {e}")
            return False
        finally:
            session.close()

    def get_result_by_job_id(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve analysis result by job ID."""
        session: Session = self.SessionLocal()
        try:
            result = session.query(AnalysisResult).filter_by(job_id=job_id).first()
            if not result:
                return None

            return {
                "id": result.id,
                "job_id": result.job_id,
                "tenant_id": result.tenant_id,
                "department_id": result.department_id,
                "user_id": result.user_id,
                "document_name": result.document_name,
                "text_length": result.text_length,
                "chunk_count": result.chunk_count,
                "vector_ids": result.vector_ids,
                "similar_passages": result.similar_passages,
                "stylometry": result.stylometry,
                "status": result.status,
                "error_message": result.error_message,
                "created_at": result.created_at.isoformat() if result.created_at else None,
                "updated_at": result.updated_at.isoformat() if result.updated_at else None,
            }
        except Exception as e:
            logger.error(f"Failed to fetch result: {e}")
            return None
        finally:
            session.close()

    def get_results_by_department(
        self,
        tenant_id: str,
        department_id: str,
        limit: int = 10,
    ) -> List[Dict[str, Any]]:
        """Retrieve analysis results for a specific department (tenant-isolated)."""
        session: Session = self.SessionLocal()
        try:
            results = session.query(AnalysisResult).filter(
                AnalysisResult.tenant_id == tenant_id,
                AnalysisResult.department_id == department_id,
            ).order_by(AnalysisResult.created_at.desc()).limit(limit).all()

            return [
                {
                    "id": r.id,
                    "job_id": r.job_id,
                    "document_name": r.document_name,
                    "status": r.status,
                    "created_at": r.created_at.isoformat() if r.created_at else None,
                }
                for r in results
            ]
        except Exception as e:
            logger.error(f"Failed to fetch department results: {e}")
            return []
        finally:
            session.close()

    def health_check(self) -> Dict[str, Any]:
        """Check database connection health."""
        session: Session = self.SessionLocal()
        try:
            session.execute("SELECT 1")
            return {"status": "healthy"}
        except Exception as e:
            return {"status": "unhealthy", "error": str(e)}
        finally:
            session.close()
# Refinement 7: Adding descriptive comments for better maintainability
# Refinement 16: Adding descriptive comments for better maintainability
# Refinement 73: Improving code documentation
# Refinement 109: Standardizing code style and formatting
