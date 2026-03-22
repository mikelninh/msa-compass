// GET /api/export
//
// Researcher export endpoint — requires API key in Authorization header.
// Returns all submissions as CSV (CDISC-aligned column names) or JSON.
//
// WHY REQUIRE API KEY? Researchers need to request access. This gives us a
// record of who has the data — important for ethics and data governance.
//
// USAGE:
//   curl -H "Authorization: Bearer YOUR_KEY" https://your-server.railway.app/api/export
//   curl -H "Authorization: Bearer YOUR_KEY" https://your-server.railway.app/api/export?format=json
//   curl -H "Authorization: Bearer YOUR_KEY" "https://your-server.railway.app/api/export?from=2025-01-01&to=2025-12-31"

const { Router } = require("express");
const { requireApiKey } = require("../middleware/validate");
const router = Router();

// Apply API key check to all export routes
router.use(requireApiKey);

router.get("/", async (req, res) => {
  const pool = req.app.get("pool");
  const { format = "csv", from, to } = req.query;

  try {
    // Build dynamic WHERE clause for optional date range filtering
    const conditions = [];
    const params = [];
    if (from) { params.push(from); conditions.push(`submission_date >= $${params.length}`); }
    if (to)   { params.push(to);   conditions.push(`submission_date <= $${params.length}`); }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await pool.query(
      `SELECT
        patient_id              AS "PATIENT_ID",
        submission_date         AS "STUDYDATE",
        feeling_score           AS "UMSARS_GLOBAL",
        sara_total              AS "SARA_TOTAL",
        symptom_balance         AS "SYMPTOM_BALANCE",
        symptom_walking         AS "SYMPTOM_WALKING",
        symptom_speech          AS "SYMPTOM_SPEECH",
        symptom_swallowing      AS "SYMPTOM_SWALLOWING",
        symptom_dizziness       AS "SYMPTOM_DIZZINESS",
        symptom_fatigue         AS "SYMPTOM_FATIGUE",
        symptom_bladder         AS "SYMPTOM_BLADDER",
        symptom_sleep           AS "SYMPTOM_SLEEP",
        gait_score              AS "GAIT_SCORE",
        gait_stride_regularity  AS "GAIT_STRIDE_REG",
        gait_sway_magnitude     AS "GAIT_SWAY",
        gait_walk_symmetry      AS "GAIT_SYMMETRY",
        gait_stride_interval_cv AS "GAIT_STRIDE_CV",
        speech_score            AS "SPEECH_SCORE",
        speech_pitch_variability AS "SPEECH_PITCH_VAR",
        speech_speaking_rate    AS "SPEECH_RATE",
        speech_pause_ratio      AS "SPEECH_PAUSE",
        speech_jitter           AS "SPEECH_JITTER",
        speech_shimmer          AS "SPEECH_SHIMMER",
        bp_lying_systolic       AS "BP_LYG_SYS",
        bp_lying_diastolic      AS "BP_LYG_DIA",
        bp_standing_systolic    AS "BP_STD_SYS",
        bp_standing_diastolic   AS "BP_STD_DIA",
        orthostatic_drop        AS "ORTHOSTATIC_DROP",
        falls_count             AS "FALLS_COUNT",
        near_falls_count        AS "NEAR_FALLS_COUNT"
      FROM submissions
      ${where}
      ORDER BY submission_date, patient_id`,
      params
    );

    if (format === "json") {
      res.setHeader("Content-Disposition", `attachment; filename="msa-compass-export.json"`);
      return res.json({
        version: "2.0",
        type: "msa_compass_research_export",
        exportDate: new Date().toISOString(),
        totalRows: result.rows.length,
        rows: result.rows,
      });
    }

    // CSV format
    const headers = Object.keys(result.rows[0] || {});
    const csvRows = result.rows.map(row =>
      headers.map(h => {
        const v = row[h];
        return v === null || v === undefined ? "" : `"${String(v).replace(/"/g, '""')}"`;
      }).join(",")
    );
    const csv = [headers.join(","), ...csvRows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="msa-compass-export-${new Date().toISOString().split("T")[0]}.csv"`);
    res.send(csv);
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
