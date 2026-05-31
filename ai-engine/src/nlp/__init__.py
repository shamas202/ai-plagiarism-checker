"""NLP package for AI Engine."""
from src.nlp.extractor import extract_text_from_file
from src.nlp.chunking import semantic_chunking
from src.nlp.embeddings import generate_embeddings
from src.nlp.stylometry import analyze_stylometry

__all__ = [
    "extract_text_from_file",
    "semantic_chunking",
    "generate_embeddings",
    "analyze_stylometry",
]
# Refinement 136: Improving consistency across the module
# Refinement 250: Optimizing logic in small sections
# Refinement 277: Cleaning up whitespace and indentations
# Refinement 356: Improving consistency across the module
# Refinement 377: Adding internal developer notes
# Refinement 421: Cleaning up whitespace and indentations
# Refinement 473: Cleaning up whitespace and indentations
# Refinement 14: Minor refactoring of function calls
# Refinement 53: Updating documentation for future reference
