"""
Semantic document chunking with overlap for vector embedding.
Preserves sentence boundaries and paragraph structure.
"""
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)


def semantic_chunking(text: str, chunk_size: int = 512, overlap: int = 50) -> List[Dict[str, Any]]:
    """
    Split text into semantic chunks with overlap.

    - Respects sentence boundaries using spaCy
    - Maintains paragraph structure where possible
    - Adds overlap between chunks for context continuity

    Returns list of dicts with 'text', 'start_idx', 'end_idx' keys.
    """
    try:
        import spacy
        nlp = spacy.load("en_core_web_sm")
    except Exception:
        logger.warning("spaCy not available, falling back to simple chunking")
        return _simple_chunking(text, chunk_size, overlap)

    doc = nlp(text)
    sentences = [sent.text.strip() for sent in doc.sents if sent.text.strip()]

    if not sentences:
        return []

    chunks = []
    current_chunk = []
    current_length = 0
    chunk_start_idx = 0

    for i, sentence in enumerate(sentences):
        sentence_length = len(sentence)

        if current_length + sentence_length > chunk_size and current_chunk:
            chunk_text = " ".join(current_chunk)
            chunks.append({
                "text": chunk_text,
                "start_idx": chunk_start_idx,
                "end_idx": chunk_start_idx + len(chunk_text),
            })

            overlap_sentences = current_chunk[-max(1, len(current_chunk) // 3):]
            current_chunk = overlap_sentences
            current_length = sum(len(s) for s in current_chunk)
            chunk_start_idx = sentences.index(overlap_sentences[0]) if overlap_sentences and overlap_sentences[0] in sentences else 0

        current_chunk.append(sentence)
        current_length += sentence_length

    if current_chunk:
        chunk_text = " ".join(current_chunk)
        chunks.append({
            "text": chunk_text,
            "start_idx": chunk_start_idx,
            "end_idx": chunk_start_idx + len(chunk_text),
        })

    logger.info(f"Created {len(chunks)} semantic chunks")
    return chunks


def _simple_chunking(text: str, chunk_size: int = 512, overlap: int = 50) -> List[Dict[str, Any]]:
    """Fallback chunking when spaCy is unavailable."""
    chunks = []
    start = 0

    while start < len(text):
        end = min(start + chunk_size, len(text))

        if end < len(text):
            last_space = text.rfind(" ", start, end)
            if last_space > start:
                end = last_space

        chunk_text = text[start:end].strip()
        if chunk_text:
            chunks.append({
                "text": chunk_text,
                "start_idx": start,
                "end_idx": end,
            })

        start = end - overlap if end > overlap else end

    return chunks
