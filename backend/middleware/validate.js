// Input validation middleware.
//
// WHY VALIDATE? The internet is full of bots and curious people. If you expose
// an endpoint without validation, someone WILL send you garbage data — either
// accidentally or maliciously. Bad data corrupts your research dataset.
//
// HOW IT WORKS: Middleware is a function with signature (req, res, next).
// Call next() to pass to the next middleware/handler. Call res.json() to stop
// the chain and respond immediately (e.g. on error).

const REQUIRED_FIELDS = ["patientId", "date", "data"];

// Very basic UUID format check (we don't need perfect UUID parsing)
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function validateSubmission(req, res, next) {
  const body = req.body;

  // Check required fields exist
  for (const field of REQUIRED_FIELDS) {
    if (!body[field]) {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }

  // patientId must look like a UUID (prevents people injecting random strings)
  if (!UUID_RE.test(body.patientId)) {
    return res.status(400).json({ error: "Invalid patientId format" });
  }

  // date must be YYYY-MM-DD and must not be in the future
  if (!DATE_RE.test(body.date)) {
    return res.status(400).json({ error: "Invalid date format — use YYYY-MM-DD" });
  }
  const submissionDate = new Date(body.date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (submissionDate > tomorrow) {
    return res.status(400).json({ error: "Date cannot be in the future" });
  }

  // data must be an object
  if (typeof body.data !== "object" || Array.isArray(body.data)) {
    return res.status(400).json({ error: "data must be an object" });
  }

  // All good — pass to the route handler
  next();
}

// API key check for researcher endpoints
// WHY API KEYS? Simple and effective for v1. No user accounts needed.
// The researcher gets a secret key, puts it in the Authorization header.
// Upgrade to OAuth/JWT when you have many researchers with different access levels.
function requireApiKey(req, res, next) {
  const authHeader = req.headers["authorization"];
  const key = authHeader?.replace("Bearer ", "");

  if (!key || key !== process.env.RESEARCHER_API_KEY) {
    return res.status(401).json({ error: "Unauthorized — valid API key required" });
  }

  next();
}

module.exports = { validateSubmission, requireApiKey };
