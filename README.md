# AI Plagiarism Checker - Multi-Tenant Content Detection Platform

A sophisticated plagiarism detection system with semantic analysis, stylometry, and strict multi-tenant data isolation.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│  Node.js API    │────▶│  Python AI      │
│   (Vercel)      │     │  (Render)       │     │  Engine         │
│   React.js      │     │  Express + JWT  │     │  FastAPI+Celery │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │                       │
                               ▼                       ▼
                        ┌─────────────────────────────────────────┐
                        │         Redis Cloud + Qdrant            │
                        │         (Queue + Vector DB)             │
                        └─────────────────────────────────────────┘
```

## Project Structure

```
ai-plagiarism-checker/
├── frontend/          # React.js application (Vercel)
├── backend/           # Node.js API Gateway (Render/Railway)
├── ai-engine/         # Python FastAPI + Celery (Render/Railway)
├── .env.example       # Root environment template
├── DEPLOYMENT.md      # Complete deployment guide
└── README.md
```

## Features

- **Semantic Plagiarism Detection** - Vector embeddings via sentence-transformers
- **Stylometry Analysis** - Writing style fingerprinting with spaCy
- **Multi-Tenant Isolation** - Department-level data separation
- **Async Processing** - Redis/Celery queue for document processing
- **Vector Search** - Qdrant/Pinecone with metadata filtering

## Quick Start

### Backend (Node.js)
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### AI Engine (Python)
```bash
cd ai-engine
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
python -m spacy download en_core_web_sm
```

## Deployment

- **Frontend**: Vercel
- **Backend**: Render/Railway Web Service
- **AI Engine**: Render/Railway Worker
- **Vector DB**: Qdrant Cloud or Pinecone
- **Redis**: Redis Cloud

## License

MIT
.
# Refinement 64: Improving code documentation
