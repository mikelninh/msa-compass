// MSA Compass — Backend API Server
//
// HOW EXPRESS WORKS:
// 1. app.use() registers middleware that runs on EVERY request
// 2. app.use("/path", router) registers middleware for a specific path prefix
// 3. When a request comes in, Express runs middleware in the order you registered it
// 4. Each middleware calls next() to pass to the next one, or res.json() to respond

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const { validateSubmission } = require("./middleware/validate");
const submitRouter = require("./routes/submit");
const statsRouter = require("./routes/stats");
const exportRouter = require("./routes/export");

const app = express();

// ── Database Connection Pool ─────────────────────────────────
// WHY A POOL? Creating a database connection is expensive (~100ms).
// A pool keeps N connections open and ready. When a request arrives,
// it borrows a connection, uses it, returns it. Much faster than
// connecting fresh for every request.
//
// DATABASE_URL comes from your environment (Railway/Supabase provides this).
// Format: postgresql://user:password@host:5432/database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 10,           // max 10 simultaneous connections
  idleTimeoutMillis: 30000,
});

// Attach pool to app so route handlers can access it via req.app.get("pool")
// WHY NOT IMPORT POOL DIRECTLY IN EACH ROUTE? This makes testing easier —
// you can swap the pool for a mock in tests.
app.set("pool", pool);

// ── Middleware ───────────────────────────────────────────────

// CORS — Cross-Origin Resource Sharing
// Browsers block JavaScript from calling APIs on different domains by default.
// This is a security feature (prevents malicious sites from calling YOUR bank's API).
// We explicitly whitelist our frontend URL. Anyone else hitting this API from
// a browser gets blocked. Direct curl/Postman calls are unaffected (not browser).
app.use(cors({
  origin: [
    "https://mikelninh.github.io",
    "http://localhost:5173",   // Vite dev server
    "http://localhost:4173",   // Vite preview
  ],
  methods: ["GET", "POST"],
}));

// Parse incoming JSON bodies. Without this, req.body is undefined.
// express.json() reads the raw bytes, parses them, puts the result on req.body.
app.use(express.json({ limit: "50kb" })); // limit prevents huge payloads

// ── Routes ──────────────────────────────────────────────────
// Health check — Railway and monitoring services ping this to verify the server is up
app.get("/health", (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// Patient submits a day's worth of anonymized data
app.use("/api/submit", validateSubmission, submitRouter);

// Public stats (shown on home screen: "X patients, Y days tracked")
app.use("/api/stats", statsRouter);

// Researcher export (requires API key)
app.use("/api/export", exportRouter);

// ── Error handling ──────────────────────────────────────────
// Catch-all for unhandled errors. Express recognizes error middleware by the
// 4-argument signature (err, req, res, next).
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: `No route: ${req.method} ${req.path}` });
});

// ── Start ────────────────────────────────────────────────────
// process.env.PORT is set by Railway automatically. 3000 is our local fallback.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MSA Compass API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

module.exports = app; // for testing
