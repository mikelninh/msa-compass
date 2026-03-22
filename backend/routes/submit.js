// POST /api/submit
//
// Receives anonymized daily tracking data from a patient's device.
// Uses an UPSERT pattern: if the patient already submitted for this date,
// update the row. If not, insert a new row.
//
// WHY UPSERT (INSERT ... ON CONFLICT DO UPDATE)?
// Users might open the app twice in a day, or submit at midnight then again
// in the morning. We want the latest data, not duplicates. The UNIQUE constraint
// on (patient_id, submission_date) enforces one row per patient per day.
// ON CONFLICT DO UPDATE replaces duplicate inserts with updates automatically.

const { Router } = require("express");
const router = Router();

router.post("/", async (req, res) => {
  const { patientId, date, data } = req.body;
  const pool = req.app.get("pool"); // pool was attached to app in server.js

  try {
    // Extract and sanitize fields from data.
    // We use explicit field extraction (not spreading the whole object) to prevent
    // users from injecting unexpected columns. Defense against mass assignment attacks.
    const feeling = toInt(data.feeling_score);
    const sara_total = toInt(data.sara?.total);
    const sara_items = Array.isArray(data.sara?.items) ? data.sara.items.map(toInt) : null;

    const bp_lying = data.bp?.find?.(r => r.position === "lying");
    const bp_standing = data.bp?.find?.(r => r.position === "standing");

    await pool.query(
      `INSERT INTO submissions (
        patient_id, submission_date,
        feeling_score,
        sara_total, sara_items,
        symptom_balance, symptom_walking, symptom_speech, symptom_swallowing,
        symptom_dizziness, symptom_fatigue, symptom_bladder, symptom_sleep,
        gait_score, gait_stride_regularity, gait_sway_magnitude, gait_walk_symmetry, gait_stride_interval_cv,
        speech_score, speech_pitch_variability, speech_speaking_rate, speech_pause_ratio, speech_jitter, speech_shimmer,
        bp_lying_systolic, bp_lying_diastolic, bp_standing_systolic, bp_standing_diastolic, orthostatic_drop,
        falls_count, near_falls_count
      ) VALUES (
        $1, $2,
        $3,
        $4, $5,
        $6, $7, $8, $9, $10, $11, $12, $13,
        $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24,
        $25, $26, $27, $28, $29,
        $30, $31
      )
      ON CONFLICT (patient_id, submission_date) DO UPDATE SET
        feeling_score           = EXCLUDED.feeling_score,
        sara_total              = EXCLUDED.sara_total,
        sara_items              = EXCLUDED.sara_items,
        symptom_balance         = EXCLUDED.symptom_balance,
        symptom_walking         = EXCLUDED.symptom_walking,
        symptom_speech          = EXCLUDED.symptom_speech,
        symptom_swallowing      = EXCLUDED.symptom_swallowing,
        symptom_dizziness       = EXCLUDED.symptom_dizziness,
        symptom_fatigue         = EXCLUDED.symptom_fatigue,
        symptom_bladder         = EXCLUDED.symptom_bladder,
        symptom_sleep           = EXCLUDED.symptom_sleep,
        gait_score              = EXCLUDED.gait_score,
        gait_stride_regularity  = EXCLUDED.gait_stride_regularity,
        gait_sway_magnitude     = EXCLUDED.gait_sway_magnitude,
        gait_walk_symmetry      = EXCLUDED.gait_walk_symmetry,
        gait_stride_interval_cv = EXCLUDED.gait_stride_interval_cv,
        speech_score            = EXCLUDED.speech_score,
        speech_pitch_variability = EXCLUDED.speech_pitch_variability,
        speech_speaking_rate    = EXCLUDED.speech_speaking_rate,
        speech_pause_ratio      = EXCLUDED.speech_pause_ratio,
        speech_jitter           = EXCLUDED.speech_jitter,
        speech_shimmer          = EXCLUDED.speech_shimmer,
        bp_lying_systolic       = EXCLUDED.bp_lying_systolic,
        bp_lying_diastolic      = EXCLUDED.bp_lying_diastolic,
        bp_standing_systolic    = EXCLUDED.bp_standing_systolic,
        bp_standing_diastolic   = EXCLUDED.bp_standing_diastolic,
        orthostatic_drop        = EXCLUDED.orthostatic_drop,
        falls_count             = EXCLUDED.falls_count,
        near_falls_count        = EXCLUDED.near_falls_count,
        submitted_at            = NOW()`,
      [
        patientId, date,
        feeling,
        sara_total, sara_items,
        toInt(data.symptoms?.balance), toInt(data.symptoms?.walking), toInt(data.symptoms?.speech), toInt(data.symptoms?.swallowing),
        toInt(data.symptoms?.dizziness), toInt(data.symptoms?.fatigue), toInt(data.symptoms?.bladder), toInt(data.symptoms?.sleep),
        toInt(data.gaitAnalysis?.gaitScore), toInt(data.gaitAnalysis?.strideRegularity), toInt(data.gaitAnalysis?.swayMagnitude), toInt(data.gaitAnalysis?.walkSymmetry), toInt(data.gaitAnalysis?.strideIntervalCV),
        toInt(data.speechAnalysis?.speechScore), toInt(data.speechAnalysis?.pitchVariability), toInt(data.speechAnalysis?.speakingRate), toInt(data.speechAnalysis?.pauseRatio), toInt(data.speechAnalysis?.jitter), toInt(data.speechAnalysis?.shimmer),
        toInt(bp_lying?.systolic), toInt(bp_lying?.diastolic), toInt(bp_standing?.systolic), toInt(bp_standing?.diastolic),
        (bp_lying && bp_standing) ? toInt(bp_lying.systolic) - toInt(bp_standing.systolic) : null,
        toInt(data.falls), toInt(data.nearFalls),
      ]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("Submit error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Convert to integer or null — never let NaN or undefined into the database
function toInt(v) {
  const n = parseInt(v, 10);
  return isNaN(n) ? null : n;
}

module.exports = router;
