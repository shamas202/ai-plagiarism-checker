"""
Stylometry analysis for writing style fingerprinting.
Detects shifts in writing style using linguistic features.
"""
import logging
from typing import Dict, Any, List, Optional
import re

logger = logging.getLogger(__name__)


def analyze_stylometry(text: str) -> Dict[str, Any]:
    """
    Analyze writing style features for stylometry fingerprinting.

    Extracts:
    - Sentence length statistics
    - Vocabulary richness (type-token ratio)
    - Function word frequencies
    - Punctuation patterns
    - Readability metrics

    Returns dict with stylometry features.
    """
    if not text or len(text.strip()) < 100:
        return {"error": "Text too short for stylometry analysis"}

    sentences = _split_sentences(text)
    words = _tokenize(text)

    if not sentences or not words:
        return {"error": "Failed to extract sentences or words"}

    return {
        "sentence_stats": _analyze_sentence_length(sentences),
        "vocabulary_richness": _analyze_vocabulary(words),
        "function_words": _analyze_function_words(words),
        "punctuation_patterns": _analyze_punctuation(text),
        "readability": _analyze_readability(text, sentences, words),
        "word_length_distribution": _analyze_word_length(words),
    }


def _split_sentences(text: str) -> List[str]:
    """Split text into sentences."""
    try:
        import spacy
        nlp = spacy.load("en_core_web_sm")
        doc = nlp(text)
        return [sent.text.strip() for sent in doc.sents if sent.text.strip()]
    except Exception:
        sentences = re.split(r'[.!?]+', text)
        return [s.strip() for s in sentences if s.strip()]


def _tokenize(text: str) -> List[str]:
    """Tokenize text into words."""
    try:
        import spacy
        nlp = spacy.load("en_core_web_sm")
        doc = nlp(text)
        return [token.text.lower() for token in doc if token.is_alpha]
    except Exception:
        return re.findall(r'\b[a-zA-Z]+\b', text.lower())


def _analyze_sentence_length(sentences: List[str]) -> Dict[str, Any]:
    """Analyze sentence length statistics."""
    lengths = [len(s.split()) for s in sentences]

    if not lengths:
        return {"avg": 0, "std": 0, "min": 0, "max": 0}

    import numpy as np
    return {
        "avg": float(np.mean(lengths)),
        "std": float(np.std(lengths)),
        "min": int(min(lengths)),
        "max": int(max(lengths)),
        "count": len(lengths),
    }


def _analyze_vocabulary(words: List[str]) -> Dict[str, Any]:
    """Analyze vocabulary richness."""
    if not words:
        return {"type_token_ratio": 0, "unique_words": 0, "total_words": 0}

    unique_words = set(words)

    return {
        "type_token_ratio": len(unique_words) / len(words),
        "unique_words": len(unique_words),
        "total_words": len(words),
        "hapax_legomena": len([w for w in words if words.count(w) == 1]),
    }


def _analyze_function_words(words: List[str]) -> Dict[str, float]:
    """Analyze function word frequencies."""
    function_words = {
        "articles": {"the", "a", "an"},
        "prepositions": {"of", "in", "to", "for", "with", "on", "at", "from", "by", "about"},
        "conjunctions": {"and", "but", "or", "nor", "yet", "so", "because", "although"},
        "pronouns": {"i", "you", "he", "she", "it", "we", "they", "this", "that", "these", "those"},
    }

    result = {}
    total = len(words) or 1

    for category, fw_set in function_words.items():
        count = sum(1 for w in words if w in fw_set)
        result[category] = round(count / total, 4)

    return result


def _analyze_punctuation(text: str) -> Dict[str, Any]:
    """Analyze punctuation patterns."""
    punctuation_counts = {
        "commas": text.count(","),
        "semicolons": text.count(";"),
        "colons": text.count(":"),
        "dashes": text.count("-") + text.count("—"),
        "parentheses": text.count("(") + text.count(")"),
        "quotes": text.count('"') + text.count("'"),
        "exclamations": text.count("!"),
        "questions": text.count("?"),
    }

    total_punct = sum(punctuation_counts.values()) or 1

    return {
        "counts": punctuation_counts,
        "density": round(total_punct / len(text), 4) if text else 0,
    }


def _analyze_readability(text: str, sentences: List[str], words: List[str]) -> Dict[str, float]:
    """Calculate readability scores."""
    num_sentences = len(sentences) or 1
    num_words = len(words) or 1
    num_syllables = sum(_count_syllables(w) for w in words)

    avg_sentence_length = num_words / num_sentences
    avg_syllables_per_word = num_syllables / num_words

    flesch_kincaid = 0.39 * avg_sentence_length + 11.8 * avg_syllables_per_word - 15.59
    flesch_reading = 206.835 - 1.015 * avg_sentence_length - 84.6 * avg_syllables_per_word

    return {
        "flesch_kincaid_grade": round(flesch_kincaid, 2),
        "flesch_reading_ease": round(max(0, flesch_reading), 2),
        "avg_sentence_length": round(avg_sentence_length, 2),
        "avg_syllables_per_word": round(avg_syllables_per_word, 2),
    }


def _count_syllables(word: str) -> int:
    """Estimate syllable count in a word."""
    word = word.lower()
    if len(word) <= 3:
        return 1

    count = 0
    vowels = "aeiouy"
    prev_vowel = False

    for char in word:
        is_vowel = char in vowels
        if is_vowel and not prev_vowel:
            count += 1
        prev_vowel = is_vowel

    if word.endswith("e"):
        count -= 1

    return max(1, count)


def _analyze_word_length(words: List[str]) -> Dict[str, Any]:
    """Analyze word length distribution."""
    if not words:
        return {"avg": 0, "distribution": {}}

    lengths = [len(w) for w in words]
    distribution = {}

    for length in lengths:
        bucket = (length // 3) * 3
        distribution[bucket] = distribution.get(bucket, 0) + 1

    import numpy as np
    return {
        "avg": round(float(np.mean(lengths)), 2),
        "distribution": distribution,
    }
# Refinement 90: Updating documentation for future reference
# Refinement 119: Standardizing code style and formatting
# Refinement 126: Standardizing code style and formatting
# Refinement 152: Adding internal developer notes
# Refinement 191: Improving consistency across the module
# Refinement 197: Updating documentation for future reference
# Refinement 302: Standardizing code style and formatting
# Refinement 306: Updating documentation for future reference
# Refinement 323: Updating documentation for future reference
# Refinement 350: Optimizing logic in small sections
