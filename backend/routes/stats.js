// GET /api/stats
//
// Public endpoint — no auth required. Returns aggregate numbers we show on the
// home screen: total patients contributing, total days tracked, total data points.
//
// WHY PUBLIC? Showing "847 patients worldwide, 12,304 days tracked" on the home
// screen motivates users to contribute. It's also harmless — no individual data.
//
// WHY NOT CACHE THIS? For v1, fine to hit the DB every time. When you have
// 10,000+ submissions, add Redis or a simple in-memory cache (recalculate every 5 min).

const { Router } = require("express");
const router = Router();

router.get("/", async (req, res) => {
  const pool = req.app.get("pool");

  try {
    const result = await pool.query(`
      SELECT
        COUNT(DISTINCT patient_id)                        AS patients,
        COUNT(*)                                          AS days_tracked,
        -- data points: rough count of non-null fields per row
        SUM(
          (feeling_score IS NOT NULL)::int +
          (sara_total IS NOT NULL)::int +
          (gait_score IS NOT NULL)::int +
          (speech_score IS NOT NULL)::int +
          (falls_count IS NOT NULL)::int +
          (bp_lying_systolic IS NOT NULL)::int +
          COALESCE(symptom_balance IS NOT NULL, false)::int +
          COALESCE(symptom_walking IS NOT NULL, false)::int
        )                                                 AS data_points
      FROM submissions
    `);

    const { patients, days_tracked, data_points } = result.rows[0];
    res.json({
      patients: parseInt(patients),
      daysTracked: parseInt(days_tracked),
      dataPoints: parseInt(data_points),
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
