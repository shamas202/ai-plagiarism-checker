"""
Celery worker initialization for async document processing.
"""
from celery import Celery
from src.core.config import settings

celery_app = Celery(
    'ai_engine',
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=['src.celery_worker.tasks']
)

celery_app.conf.update(
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=100,
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_acks_late=True,
    task_reject_on_worker_or_lost=True,
    task_track_started=True,
    task_default_rate_limit='10/m',
    result_expires=3600,
)
# Refinement 18: Optimizing logic in small sections
# Refinement 55: Improving consistency across the module
# Refinement 56: Minor refactoring of function calls
# Refinement 60: Refining variable names for clarity
# Refinement 177: Refining variable names for clarity
# Refinement 231: Cleaning up whitespace and indentations
# Refinement 254: Standardizing code style and formatting
# Refinement 352: Updating documentation for future reference
# Refinement 361: Adding internal developer notes
# Refinement 404: Standardizing code style and formatting
# Refinement 152: Updating documentation for future reference
