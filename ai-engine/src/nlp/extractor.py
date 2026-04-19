"""
Text extraction from various document formats.
Supports: PDF, DOCX, DOC, TXT, MD
"""
import logging
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)


def extract_text_from_file(file_path: str, mime_type: Optional[str] = None) -> str:
    """Extract text content from uploaded document."""
    path = Path(file_path)
    suffix = path.suffix.lower()

    if suffix == '.pdf' or mime_type == 'application/pdf':
        return _extract_from_pdf(file_path)
    elif suffix in ['.docx', '.doc'] or 'word' in (mime_type or ''):
        return _extract_from_docx(file_path)
    elif suffix in ['.txt', '.md'] or 'text/' in (mime_type or ''):
        return _extract_from_text(file_path)
    else:
        return _extract_from_text(file_path)


def _extract_from_pdf(file_path: str) -> str:
    """Extract text from PDF using pdfplumber."""
    import pdfplumber

    text_parts = []
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text)
        return '\n\n'.join(text_parts)
    except Exception as e:
        logger.error(f"PDF extraction failed: {e}")
        raise ValueError(f"Failed to extract text from PDF: {e}")


def _extract_from_docx(file_path: str) -> str:
    """Extract text from DOCX using python-docx."""
    from docx import Document

    try:
        doc = Document(file_path)
        paragraphs = [para.text for para in doc.paragraphs if para.text.strip()]
        return '\n\n'.join(paragraphs)
    except Exception as e:
        logger.error(f"DOCX extraction failed: {e}")
        raise ValueError(f"Failed to extract text from DOCX: {e}")


def _extract_from_text(file_path: str) -> str:
    """Read plain text file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except UnicodeDecodeError:
        with open(file_path, 'r', encoding='latin-1') as f:
            return f.read()
    except Exception as e:
        logger.error(f"Text file extraction failed: {e}")
        raise ValueError(f"Failed to extract text from file: {e}")
