"""
Vector embedding generation using sentence-transformers.
Produces dense vector representations for semantic search.
"""
import logging
from typing import List, Dict, Any, Optional
import numpy as np

logger = logging.getLogger(__name__)

_model = None


def get_embedding_model(model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
    """Lazy-load the embedding model."""
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer(model_name)
        logger.info(f"Loaded embedding model: {model_name}")
    return _model


def generate_embeddings(
    chunks: List[Dict[str, Any]],
    model_name: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Generate vector embeddings for text chunks.

    Returns dict with 'vectors' list of (text, vector) tuples.
    """
    if not chunks:
        return {"vectors": [], "dimension": 0}

    model_name = model_name or "sentence-transformers/all-MiniLM-L6-v2"

    try:
        model = get_embedding_model(model_name)
    except Exception as e:
        logger.error(f"Failed to load embedding model: {e}")
        raise ValueError(f"Embedding model load failed: {e}")

    texts = [chunk["text"] for chunk in chunks]

    try:
        embeddings = model.encode(
            texts,
            batch_size=32,
            show_progress_bar=True,
            convert_to_numpy=True,
            normalize_embeddings=True,
        )
    except Exception as e:
        logger.error(f"Embedding generation failed: {e}")
        raise ValueError(f"Failed to generate embeddings: {e}")

    vectors = []
    for i, chunk in enumerate(chunks):
        vector = embeddings[i].tolist()
        vectors.append({
            "text": chunk["text"],
            "vector": vector,
            "start_idx": chunk.get("start_idx", 0),
            "end_idx": chunk.get("end_idx", 0),
        })

    logger.info(f"Generated {len(vectors)} embeddings with dimension {len(vectors[0]['vector']) if vectors else 0}")

    return {
        "vectors": vectors,
        "dimension": len(vectors[0]["vector"]) if vectors else 0,
        "model": model_name,
    }


def compute_similarity(vector1: List[float], vector2: List[float]) -> float:
    """Compute cosine similarity between two vectors."""
    v1 = np.array(vector1)
    v2 = np.array(vector2)

    dot_product = np.dot(v1, v2)
    norm1 = np.linalg.norm(v1)
    norm2 = np.linalg.norm(v2)

    if norm1 == 0 or norm2 == 0:
        return 0.0

    return float(dot_product / (norm1 * norm2))
# Refinement 31: Adding descriptive comments for better maintainability
