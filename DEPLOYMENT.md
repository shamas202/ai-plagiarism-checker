## Deployment Guide - Multi-Tenant Plagiarism Checker

Complete step-by-step instructions for GitHub, Vercel (Frontend), and Render/Railway (Backend + AI Engine).

---

## Prerequisites::

- GitHub account
- Vercel account (free tier works)
- Render or Railway account (free tier available)
- Qdrant Cloud account (or Pinecone)
- Redis Cloud account (free tier: 30MB)

---

## Step 1: Initialize Git Repository

```bash
cd C:\Users\Shams S\Downloads\ai-plagrism-checker

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create .gitignore if missing
echo "node_modules/" >> .gitignore
echo "__pycache__/" >> .gitignore
echo "*.pyc" >> .gitignore
echo ".env" >> .gitignore
echo "uploads/" >> .gitignore
echo "venv/" >> .gitignore
echo ".DS_Store" >> .gitignore

# Initial commit
git commit -m "Initial commit: Multi-tenant plagiarism checker with AI engine"
```

---

## Step 2: Create GitHub Repository

```bash
# Create repo via GitHub CLI (recommended) or use GitHub web UI
gh repo create ai-plagiarism-checker --public --source=. --remote=origin

# Push to GitHub
git branch -M main
git push -u origin main
```

**Via GitHub Web UI:**
1. Go to https://github.com/new
2. Repository name: `ai-plagiarism-checker`
3. Visibility: Public or Private
4. **DO NOT** initialize with README/.gitignore (you already have them)
5. Click "Create repository"
6. Follow the push commands shown

---

## Step 3: Set Up External Services

### 3.1 Redis Cloud (Free Tier)

1. Go to https://redis.com/try-free/
2. Create free account
3. Create new database:
   - Name: `plagiarism-queue`
   - Type: Redis
   - Memory: 30MB (free tier)
4. Copy connection details:
   - Host: `redis-xxxxx.cloud.redislabs.com`
   - Port: `12345`
   - Password: `your-password`

### 3.2 Qdrant Cloud (Free Tier)

1. Go to https://cloud.qdrant.io/
2. Create account
3. Create new cluster (free tier available)
4. Get API key from dashboard
5. Copy cluster URL (e.g., `https://xxx-xxx.cloud.qdrant.io`)

### 3.3 PostgreSQL (Render/Railway Built-in)

**Render:**
1. Create new PostgreSQL database
2. Copy connection string

**Railway:**
1. Create new project
2. Add PostgreSQL plugin
3. Copy `DATABASE_URL` from variables

---

## Step 4: Deploy Frontend to Vercel

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel
```

**Via Vercel Web UI (Recommended):**

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `ai-plagiarism-checker` repo
4. **Framework Preset:** Vite (or Create React App)
5. **Root Directory:** `frontend`
6. **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   VITE_ENABLE_STYLOMETRY=true
   VITE_ENABLE_SEMANTIC_SEARCH=true
   VITE_MAX_FILE_SIZE_MB=10
   ```
7. Click "Deploy"

---

## Step 5: Deploy Backend (Node.js) to Render

1. Go to https://render.com/new
2. Select "Web Service"
3. Connect your GitHub repo
4. **Configure:**
   - Name: `plagiarism-api-gateway`
   - Root Directory: `backend`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free

5. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=<your-32-char-secret>
   REDIS_HOST=<redis-cloud-host>
   REDIS_PORT=<redis-cloud-port>
   REDIS_PASSWORD=<redis-password>
   REDIS_TLS=true
   QUEUE_NAME=document_processing
   DATABASE_URL=<render-postgres-url>
   FRONTEND_URL=https://your-app.vercel.app
   MAX_FILE_SIZE=10485760
   STORAGE_PATH=./uploads
   LOG_LEVEL=info
   ```

6. Click "Create Web Service"

---

## Step 6: Deploy AI Engine (Python) to Render

### Option A: Render Worker (Recommended for Celery)

1. Go to https://render.com/new
2. Select "Background Worker"
3. Connect your GitHub repo
4. **Configure:**
   - Name: `plagiarism-ai-engine`
   - Root Directory: `ai-engine`
   - Runtime: Python 3
   - Build Command:
     ```bash
     pip install -r requirements.txt
     python -m spacy download en_core_web_sm
     ```
   - Start Command:
     ```bash
     celery -A src.celery_worker worker --loglevel=info
     ```

5. **Environment Variables:**
   ```
   ENVIRONMENT=production
   LOG_LEVEL=INFO
   REDIS_HOST=<redis-cloud-host>
   REDIS_PORT=<redis-cloud-port>
   REDIS_PASSWORD=<redis-password>
   REDIS_TLS=true
   QDRANT_URL=<qdrant-cluster-url>
   QDRANT_API_KEY=<qdrant-api-key>
   QDRANT_COLLECTION=document_embeddings
   DATABASE_URL=<render-postgres-url>
   EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
   EMBEDDING_DIMENSION=384
   SPACY_MODEL=en_core_web_sm
   CHUNK_SIZE=512
   CHUNK_OVERLAP=50
   MIN_SIMILARITY_THRESHOLD=0.7
   STORAGE_PATH=./uploads
   JWT_SECRET=<same-as-backend>
   FRONTEND_URL=https://your-app.vercel.app
   ```

### Option B: Render Web Service + Celery Beat

For a complete setup with FastAPI dashboard:

1. Create **Web Service** for FastAPI:
   - Start Command: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`

2. Create **Background Worker** for Celery (as above)

---

## Step 7: Alternative - Deploy to Railway

### Backend (Node.js):

1. Go to https://railway.app/
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repo
4. **Root Directory:** `backend`
5. Add environment variables (same as Render)
6. Railway auto-detects Node.js and deploys

### AI Engine (Python):

1. In same project, add another service
2. **Root Directory:** `ai-engine`
3. Add environment variables
4. Railway auto-detects Python

---

## Step 8: Database Setup (PostgreSQL)

The AI Engine will auto-create tables on first run via SQLAlchemy's `Base.metadata.create_all()`.

**Manual migration (optional):**

```sql
CREATE TABLE IF NOT EXISTS analysis_results (
    id VARCHAR PRIMARY KEY,
    job_id VARCHAR NOT NULL,
    tenant_id VARCHAR NOT NULL,
    department_id VARCHAR NOT NULL,
    user_id VARCHAR NOT NULL,
    document_name VARCHAR NOT NULL,
    text_length INTEGER DEFAULT 0,
    chunk_count INTEGER DEFAULT 0,
    vector_ids JSONB DEFAULT '[]',
    similar_passages JSONB DEFAULT '[]',
    stylometry JSONB DEFAULT '{}',
    status VARCHAR DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_job_id ON analysis_results(job_id);
CREATE INDEX idx_tenant_department ON analysis_results(tenant_id, department_id);
```

---

## Step 9: Verify Deployment

### Backend Health Check:
```bash
curl https://your-backend.onrender.com/api/health
```

Expected response:
```json
{ "status": "healthy" }
```

### AI Engine Health Check:
```bash
curl https://your-ai-engine.onrender.com/health
```

### Frontend:
Visit your Vercel URL and test document upload.

---

## Step 10: Update Frontend API URL

After backend is deployed, update Vercel environment variable:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `VITE_API_URL` to your Render backend URL
3. Redeploy frontend

---

## Troubleshooting

### Backend won't start:
- Check Render logs for errors
- Verify `DATABASE_URL` and `REDIS_*` vars
- Ensure `JWT_SECRET` is 32+ characters

### AI Engine not processing jobs:
- Check Celery worker logs
- Verify Redis connection (TLS setting)
- Ensure spaCy model downloaded: `python -m spacy download en_core_web_sm`

### Cross-origin errors:
- Update `FRONTEND_URL` in backend env vars
- Check CORS middleware configuration

### Vector search returns no results:
- Verify Qdrant credentials
- Check collection exists in Qdrant dashboard
- Ensure `department_id` filter matches uploaded documents

---

## Cost Estimate (Free Tier)

| Service | Free Tier | Paid Upgrade |
|---------|-----------|--------------|
| Vercel Frontend | ✅ Unlimited deployments | $20/mo for team |
| Render Backend | ✅ 750 hrs/month | $7/mo for always-on |
| Render Worker | ✅ 750 hrs/month | $7/mo for always-on |
| Railway | ✅ $5 credit/month | Pay as you go |
| Redis Cloud | ✅ 30MB | $5/mo for 250MB |
| Qdrant Cloud | ✅ Free tier available | $20/mo for production |
| PostgreSQL (Render) | ✅ 1GB free | $7/mo for more |

**Total: ~$0-20/month** for free tier, **~$30-50/month** for production setup

---

## Next Steps

1. Set up monitoring (Render/Railway dashboards)
2. Configure log aggregation (optional)
3. Set up SSL certificates (automatic on Vercel/Render)
4. Add rate limiting and DDoS protection
5. Configure backup strategy for PostgreSQL
# Refinement 11: Cleaning up whitespace and indentations
# Refinement 36: Optimizing logic in small sections
