-- MSA Compass — PostgreSQL Schema
-- Run this once in Supabase SQL editor to create the table.

-- Each row = one patient's data for one day.
-- patient_id is a random UUID generated on the device — never tied to a real person.
-- The UNIQUE constraint means one submission per patient per day (upsert pattern).

CREATE TABLE IF NOT EXISTS submissions (
  id                      SERIAL PRIMARY KEY,
  patient_id              TEXT NOT NULL,        -- random UUID from device, pseudonymous
  submission_date         DATE NOT NULL,        -- the day this data is for (YYYY-MM-DD)
  submitted_at            TIMESTAMPTZ DEFAULT NOW(),

  -- Daily check-in (0=much_worse, 2=same, 4=much_better — UMSARS-aligned global)
  feeling_score           SMALLINT CHECK (feeling_score BETWEEN 0 AND 4),

  -- SARA: Scale for Assessment and Rating of Ataxia (0-24 total, 8 items × 0-3)
  sara_total              SMALLINT CHECK (sara_total BETWEEN 0 AND 24),
  sara_items              SMALLINT[8],          -- array of 8 individual item scores

  -- Symptom domains (0=none, 1=mild, 2=moderate, 3=severe — UMSARS-II aligned)
  symptom_balance         SMALLINT CHECK (symptom_balance BETWEEN 0 AND 3),
  symptom_walking         SMALLINT CHECK (symptom_walking BETWEEN 0 AND 3),
  symptom_speech          SMALLINT CHECK (symptom_speech BETWEEN 0 AND 3),
  symptom_swallowing      SMALLINT CHECK (symptom_swallowing BETWEEN 0 AND 3),
  symptom_dizziness       SMALLINT CHECK (symptom_dizziness BETWEEN 0 AND 3),
  symptom_fatigue         SMALLINT CHECK (symptom_fatigue BETWEEN 0 AND 3),
  symptom_bladder         SMALLINT CHECK (symptom_bladder BETWEEN 0 AND 3),
  symptom_sleep           SMALLINT CHECK (symptom_sleep BETWEEN 0 AND 3),

  -- Gait analysis (from accelerometer)
  gait_score              SMALLINT CHECK (gait_score BETWEEN 0 AND 100),
  gait_stride_regularity  SMALLINT CHECK (gait_stride_regularity BETWEEN 0 AND 100),
  gait_sway_magnitude     SMALLINT CHECK (gait_sway_magnitude BETWEEN 0 AND 100),
  gait_walk_symmetry      SMALLINT CHECK (gait_walk_symmetry BETWEEN 0 AND 100),
  gait_stride_interval_cv SMALLINT,            -- coefficient of variation % (key ataxia biomarker)

  -- Speech analysis (from Web Audio API)
  speech_score            SMALLINT CHECK (speech_score BETWEEN 0 AND 100),
  speech_pitch_variability SMALLINT,
  speech_speaking_rate    SMALLINT,
  speech_pause_ratio      SMALLINT,
  speech_jitter           SMALLINT,            -- cycle-to-cycle pitch variability (dysarthria marker)
  speech_shimmer          SMALLINT,            -- cycle-to-cycle amplitude variability (dysarthria marker)

  -- Blood pressure (orthostatic hypotension is a key MSA autonomic feature)
  bp_lying_systolic       SMALLINT,
  bp_lying_diastolic      SMALLINT,
  bp_standing_systolic    SMALLINT,
  bp_standing_diastolic   SMALLINT,
  orthostatic_drop        SMALLINT,            -- lying_sys - standing_sys (≥20 = significant)

  -- Falls
  falls_count             SMALLINT,
  near_falls_count        SMALLINT,

  -- One row per patient per day — if they re-submit, update in place (upsert)
  UNIQUE (patient_id, submission_date)
);

-- Indexes make queries fast. Without them, every query scans the whole table.
-- We'll often query by date range (for trends) and by patient (for natural history).
CREATE INDEX IF NOT EXISTS idx_submission_date ON submissions (submission_date);
CREATE INDEX IF NOT EXISTS idx_patient_id ON submissions (patient_id);
CREATE INDEX IF NOT EXISTS idx_submitted_at ON submissions (submitted_at);

-- Aggregate view for the research dashboard — researchers query this, not raw rows
CREATE OR REPLACE VIEW research_summary AS
SELECT
  submission_date,
  COUNT(DISTINCT patient_id)          AS patients_reporting,
  AVG(feeling_score)                  AS avg_feeling,
  AVG(sara_total)                     AS avg_sara,
  AVG(gait_score)                     AS avg_gait_score,
  AVG(gait_stride_interval_cv)        AS avg_stride_cv,
  AVG(speech_score)                   AS avg_speech_score,
  AVG(speech_jitter)                  AS avg_jitter,
  AVG(speech_shimmer)                 AS avg_shimmer,
  AVG(orthostatic_drop)               AS avg_orthostatic_drop,
  SUM(falls_count)                    AS total_falls
FROM submissions
GROUP BY submission_date
ORDER BY submission_date;
