# Deploying MSA Compass Backend

Step-by-step deployment on Railway (free tier) + Supabase (free PostgreSQL).

---

## Step 1: Set up the database on Supabase

1. Go to https://supabase.com → create account → New Project
2. Name it `msa-compass`, choose a region close to your users (Japan/US)
3. Wait for project to spin up (~2 min)
4. Go to **SQL Editor** → paste the entire contents of `db/schema.sql` → Run
5. Go to **Project Settings → Database → Connection string → URI**
   Copy it — this is your `DATABASE_URL`

---

## Step 2: Deploy the API on Railway

1. Go to https://railway.app → Login with GitHub
2. New Project → Deploy from GitHub repo → select `msa-compass` (or this backend folder)
3. Railway detects Node.js automatically
4. Go to **Variables** tab → add:
   - `DATABASE_URL` = the Supabase URI from Step 1
   - `RESEARCHER_API_KEY` = run this locally to generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `NODE_ENV` = `production`
5. Railway deploys automatically on every git push
6. Go to **Settings → Networking → Generate Domain** to get your public URL

Your API is now live at: `https://msa-compass-api-xxxx.railway.app`

---

## Step 3: Connect the frontend

In `src/MSACompass.jsx`, update the `API_BASE` constant:
```js
const API_BASE = "https://msa-compass-api-xxxx.railway.app";
```

The frontend already has the submit/stats logic wired up — just needs the URL.

---

## Testing your endpoints

```bash
# Health check
curl https://your-server.railway.app/health

# Public stats
curl https://your-server.railway.app/api/stats

# Submit test data
curl -X POST https://your-server.railway.app/api/submit \
  -H "Content-Type: application/json" \
  -d '{"patientId":"550e8400-e29b-41d4-a716-446655440000","date":"2025-03-23","data":{"feeling_score":2}}'

# Researcher export (replace YOUR_KEY)
curl -H "Authorization: Bearer YOUR_KEY" \
  https://your-server.railway.app/api/export > export.csv
```

---

## Understanding costs

- **Supabase free tier**: 500MB storage, 2GB bandwidth/month. Enough for thousands of patients.
- **Railway free tier**: $5 credit/month. A Node.js server uses ~$1-2/month.

When you outgrow free tiers:
- Supabase Pro: $25/month (8GB storage)
- Railway: pay-as-you-go (usually ~$5-10/month for a small API)
